<?php

class FrmProEntryFormat {

	/**
	 * @since 2.3
	 */
	public static function prepare_entry_content( $entry, $atts ) {
		$atts['include_blank'] = true;
		FrmProEntryMeta::add_post_value_to_entry( $atts['field'], $entry );
		self::add_sub_array_to_entry( $atts['field'], $entry, $atts );
		return $entry;
	}

	/**
	 * Add each linked entry as an array
	 * @since 2.3
	 */
	public static function add_sub_array_to_entry( $field, &$entry, $atts = array() ) {
		if ( $entry->form_id != $field->form_id ) {
			if ( ! isset( $entry->sub_entries ) ) {
				$entry->sub_entries = array();
			}
			$section_id = $field->field_options['in_section'];
			if ( $section_id && isset( $entry->metas[ $section_id ] ) ) {
				$sub_entry_ids = $entry->metas[ $section_id ];
				$child_entries = FrmEntry::getAll( array( 'parent_item_id' => $entry->id, 'id' => $sub_entry_ids ), '', '', true, false );
			} else {
				// get entry ids linked through repeat field or embeded form
				$child_entries = FrmProEntry::get_sub_entries( $entry->id, true );
			}

			foreach ( $child_entries as $child_entry ) {
				if ( ! isset( $entry->sub_entries[ $child_entry->id ] ) ) {
					$entry->sub_entries[ $child_entry->id ] = array();
				}
				$entry->sub_entries[ $child_entry->id ][ $field->id ] = FrmProEntryMetaHelper::get_post_or_meta_value( $child_entry, $field, $atts );
				$entry->sub_entries[ $child_entry->id ]['section_id'] = $section_id;
			}
		} else {
			// get values linked through a dynamic field
			$val = '';
			FrmProEntriesHelper::get_dynamic_list_values( $field, $entry, $val );
			$entry->metas[ $field->id ] = $val;
		}
	}

	/**
	 * Used for the frm-show-entry shortcode and default emails
	 * @since 2.3
	 */
	public static function prepare_entry_array( $values, $atts ) {
		$field = $atts['field'];
		$in_child_form = $field->form_id != $atts['form_id'];

		if ( isset( $atts['entry']->sub_entries ) && $in_child_form ) {
			if ( ! isset( $values[ $field->field_options['in_section'] ] ) ) {
				$values[ $field->field_options['in_section'] ] = array( 'label' => '', 'val' => '', 'type' => 'divider' );
			}

			foreach ( $atts['entry']->sub_entries as $sub_id => $sub_entry ) {
				$is_blank = ( ! $atts['include_blank'] && isset( $sub_entry[ $field->id ] ) && $sub_entry[ $field->id ] == '' );
				$entry_in_section = $sub_entry['section_id'] == $field->field_options['in_section'];
				if ( $is_blank || ! $entry_in_section ) {
					continue;
				}
				if ( ! isset( $values[ $field->field_options['in_section'] ]['entries'][ $sub_id ] ) ) {
					$values[ $field->field_options['in_section'] ]['entries'][ $sub_id ] = array();
				}

				$val = $sub_entry[ $field->id ];
				self::get_field_value( $atts, $val );

				$values[ $field->field_options['in_section'] ]['entries'][ $sub_id ][ $field->id ] = array(
					'label' => $field->name,
					'val'   => $val,
					'type'  => $field->type,
				);
			}
		}

		return $values;
	}

	private static function get_field_value( $atts, &$val ) {
		$field = $atts['field'];
		if ( $atts['entry'] ) {
			$meta = array(
				'item_id' => $atts['id'], 'field_id' => $field->id,
				'meta_value' => $val, 'field_type' => $field->type,
			);

			if ( isset( $atts['filter'] ) && $atts['filter'] == false ) {
				$val = $prev_val;
			} else {
				$val = apply_filters( 'frm_email_value', $val, (object) $meta, $atts['entry'], compact( 'field' ) );
			}

			FrmEntryFormat::prepare_field_output( $atts, $val );
		}
	}

	/**
	 * Set the Dynamic List field shortcodes for the default HTML email
	 *
	 * @since 2.0.23
	 * @param array $field_shortcodes
	 * @param object $f
	 * @return array
	 */
	public static function default_email_shortcodes( $field_shortcodes, $f ) {
		if ( $f->type == 'data' && $f->field_options['data_type'] == 'data' ) {
			if ( ! empty( $f->field_options['hide_field'] ) && ! empty( $f->field_options['form_select'] ) ) {
				$field_id_string = reset( $f->field_options[ 'hide_field' ] ) . ' show=' . $f->field_options[ 'form_select' ];
				$field_shortcodes['val'] = '[' . $field_id_string . ']';
			}
		} elseif ( $f->type == 'divider' ) {
			$field_shortcodes['val'] = '[' . $f->id . ' show=description]';
			if ( FrmField::is_option_true( $f, 'repeat' ) ) {
				$option_setting = 'in_section";s:' . strlen( $f->id ) . ':"' . $f->id . '"';
				$sub_fields = FrmDb::get_col( 'frm_fields', array( 'field_options like' => $option_setting ) );

				$field_shortcodes['entries'] = array( 0 => array() );
				foreach ( $sub_fields as $sub_field_id ) {
					$sub_field = FrmField::getOne( $sub_field_id );
					FrmEntryFormat::get_field_shortcodes_for_default_email( $sub_field, $field_shortcodes['entries'][0] );
				}
			}
		}

		return $field_shortcodes;
	}

	public static function single_plain_text_row( $row, $atts ) {
		if ( $atts['value']['type'] == 'break' ) {
			$row[] = "\r\n\r\n";
		} elseif ( $atts['value']['type'] == 'divider' ) {
			$row = array();
			if ( $atts['value']['label'] != '' ) {
				$row[] = "\r\n" . $atts['value']['label'] . "\r\n";
			}
			$atts['function'] = __FUNCTION__;
			self::add_sub_entries( $atts, $row );
		} elseif ( $atts['value']['type'] == 'html' ) {
			$row[] = $atts['value']['val'] . "\r\n";
		}
		return $row;
	}

	public static function single_html_row( $row, $atts ) {
		if ( ! isset( $atts['value']['type'] ) ) {
			return $row;
		}

		if ( $atts['value']['type'] == 'break' ) {
			$atts['value']['val'] = '<br/><br/>';
		} elseif ( $atts['value']['type'] == 'divider' ) {
			$row = array();
			if ( $atts['value']['label'] != '' ) {
				$atts['value']['val'] = '<h3>' . $atts['value']['label'] . '</h3> ';
				FrmEntryFormat::html_field_row( $atts, $row );
			}
			$atts['function'] = __FUNCTION__;
			self::add_sub_entries( $atts, $row );
		}

		if ( in_array( $atts['value']['type'], array( 'break', 'html' ) ) ) {
			$row = array();
			FrmEntryFormat::html_field_row( $atts, $row );
		}

		return $row;
	}

	private static function add_sub_entries( $atts, &$content ) {
		$value = $atts['value'];
		if ( isset( $value['entries'] ) ) {
			$section_id = $atts['id'];
			foreach ( $value['entries'] as $entry ) {
				if ( $atts['default_email'] ) {
					$content[] = '[foreach ' . $section_id . ']' . "\r\n";
				}
				foreach ( $entry as $id => $field ) {
					$atts['id'] = $id;
					$atts['value'] = $field;
					$function = $atts['function'];
					FrmEntryFormat::$function( $atts, $content );
				}
				if ( $atts['default_email'] ) {
					$content[] = '[/foreach ' . $section_id . ']' . "\r\n";
				}
				$content[] = "\r\n";
			}
		}
	}
}
