$().ready(function() {
  var source, template;

  // load the template
  load_template('templates/gamethread.hjs')

  $('input, select').on('change', function() {

    var context = create_context();
    var markdown = template(context);

    console.log(context)

    // show the markdown results :P
    $('pre').html(markdown);
  })

  function create_context() {
    var context = {hometeam: [], awayteam:[]}

    // Grab all the general stuff
    assign_values(context, '.general');

    // Grab Home team - .next is a hack
    $('.home').next().find('tr').each(function(i, el) {
      if(i == 0) return;
      var ctx = {};
      assign_values(ctx, el);
      context.hometeam.push(ctx);
    })

    // Grab Away team - .next is a hack
    $('.away').next().find('tr').each(function(i, el) {
      if(i == 0) return;
      var ctx = {};
      assign_values(ctx, el);
      context.awayteam.push(ctx);
    })

    return context;
  }

  function assign_values(context, element) {
    $('input, select', element).each(function(i, el) {
      var key = $(el).attr('name');
      var value = $(el).val();
      context[key] = value;
    })
  }

  function load_template(src) {
    $.ajax({
      url: src,
      cache: true,
      success: function(data) {
        source = data;
        template = Handlebars.compile(source);
      }
    })
  }
})
