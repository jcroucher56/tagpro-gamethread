$().ready(function() {
  var source, template;

  // load the template
  load_template('templates/gamethread.hjs')

  $('.first-half [name=name]').on('change', function() {
    var name = $(this).val();
    var sh = $(this).closest('.first-half').next().find('input[name=name]');
    sh.val(name);
  })

  $('input, select').on('change', function() {

    var context = create_context();
    var markdown = template(context);

    console.log(context)

    // show the markdown results :P
    $('pre').html(markdown);
  })


  function create_context() {
    var context = {
      firsthalf: {
        hometeam: [], 
        awayteam: []
      },
      secondhalf: {
        hometeam: [], 
        awayteam: []
      }
    }

    // Grab all the general stuff
    assign_values(context, '.general');

    // Grab Home team - .next is a hack
    $('.home').next().find('tr.first-half').each(function(i, el) {
      var ctx = {};
      assign_values(ctx, el);
      if(Object.keys(ctx).length > 1)
        context.firsthalf.hometeam.push(ctx);
    })

    // Grab Away team - .next is a hack
    $('.away').next().find('tr.first-half').each(function(i, el) {
      var ctx = {};
      assign_values(ctx, el);
      if(Object.keys(ctx).length > 1)
        context.firsthalf.awayteam.push(ctx);
    })

    // Grab Home team - .next is a hack
    $('.home').next().find('tr.second-half').each(function(i, el) {
      var ctx = {};
      assign_values(ctx, el);
      if(Object.keys(ctx).length > 1)
        context.secondhalf.hometeam.push(ctx);
    })

    // Grab Away team - .next is a hack
    $('.away').next().find('tr.second-half').each(function(i, el) {
      var ctx = {};
      assign_values(ctx, el);
      if(Object.keys(ctx).length > 1)
        context.secondhalf.awayteam.push(ctx);
    })

    return context;
  }

  function assign_values(context, element) {
    $('input, select', element).each(function(i, el) {
      var key = $(el).attr('name');
      var value = $(el).val();
      if(value)
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
