<?php
/*
Plugin Name: FI Léglistatives Main
Description: Template project main site plugin.
Depends: Advanced Custom Fields
Version: 1.0.0
*/

add_action('init', function() {
  // Register styles.
  wp_register_style('fi-all-sites', plugins_url('css/fi-all-sites.css', __FILE__));
});

/**
 * Create the 'sites' post type.
 */
add_action('init', function() {
  $labels = array(
    "name" => __( 'Sites', '' ),
    "singular_name" => __( 'Site', '' ),
  );

  $args = array(
    "label" => __( 'Sites', '' ),
    "labels" => $labels,
    "description" => "",
    "public" => true,
    "publicly_queryable" => true,
    "show_ui" => true,
    "show_in_rest" => false,
    "rest_base" => "",
    "has_archive" => false,
    "show_in_menu" => true,
    "exclude_from_search" => false,
    "capability_type" => "post",
    "map_meta_cap" => true,
    "hierarchical" => false,
    "rewrite" => array( "slug" => "sites", "with_front" => true ),
    "query_var" => true,
    "supports" => array( "title", "editor", "thumbnail" ),
  );

  register_post_type("sites", $args);

  if(function_exists("register_field_group")) {
    register_field_group(array (
      'id' => 'acf_sites',
      'title' => 'Sites',
      'fields' => array (
        array (
          'key' => 'field_592c0eb73b5cd',
          'label' => 'Numéro',
          'name' => 'number',
          'type' => 'text',
          'instructions' => 'Numéro de la circonscription : xx-x',
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'formatting' => 'html',
          'maxlength' => '',
        ),
        array (
          'key' => 'field_592c0ece3b5ce',
          'label' => 'Titre',
          'name' => 'title',
          'type' => 'text',
          'instructions' => 'Nom arbitraire',
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'formatting' => 'html',
          'maxlength' => '',
        ),
        array (
          'key' => 'field_592c0ef43b5cf',
          'label' => 'Photo',
          'name' => 'picture',
          'type' => 'image',
          'save_format' => 'object',
          'preview_size' => 'thumbnail',
          'library' => 'all',
        ),
        array (
          'key' => 'field_592c0eff3b5d0',
          'label' => 'Lien',
          'name' => 'link',
          'type' => 'text',
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'formatting' => 'html',
          'maxlength' => '',
        ),
        array (
          'key' => 'field_592c0f0d3b5d1',
          'label' => 'Candidats',
          'name' => 'candidates',
          'type' => 'text',
          'default_value' => '',
          'placeholder' => '',
          'prepend' => '',
          'append' => '',
          'formatting' => 'html',
          'maxlength' => '',
        ),
      ),
      'location' => array (
        array (
          array (
            'param' => 'post_type',
            'operator' => '==',
            'value' => 'sites',
            'order_no' => 0,
            'group_no' => 0,
          ),
        ),
      ),
      'options' => array (
        'position' => 'normal',
        'layout' => 'default',
        'hide_on_screen' => array (
        ),
      ),
      'menu_order' => 0,
    ));
  }

});

/**
 * Custom shortcode for the main website.
 *
 * Lists all the referenced sites into a unordered HTML list.
 * Warning: this can only be used on main site (network head).
 */
add_shortcode('fi-all-sites', function ($atts) {
  $replacement = '';

  // Get all published sites.
  query_posts(array(
    'post_type' => 'sites',
    'showposts' => -1
  ));

  // Build the list.
  if (have_posts()) {
    $replacement .= '<ul class="fi-all-sites">';
    while (have_posts()) {
      the_post();
      $replacement .= '<li>';
      $replacement .= '<a href="' . get_field('link') . '">';
      if ($picture = get_field('picture')) {
        $replacement .= '<img src="' . $picture['url'] . '" alt="' . the_title('', '', false) . '" width="' . $picture['width'] . '" height="' . $picture['height'] . '">';
      }
      $replacement .= '<p><strong>' . get_field('number') . ' - ' . get_field('candidates') . '</strong></p>';
      $replacement .= '<p>' . the_title('', '', false) . '</p>';
      $replacement .= '<p><em>' . get_field('link') . '</em></p>';
      $replacement .= '</a>';
      $replacement .= '</li>';
    }
    $replacement .= '</ul>';
  }
  wp_reset_query();

  // Inject custom stylesheet in the page.
  wp_enqueue_style('fi-all-sites');

  return $replacement;
});
