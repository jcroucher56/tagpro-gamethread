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

  //  console.log(context)

    // show the markdown results :P
    $('pre').html(markdown);
  })

  $('input[type=button]').click(function() {
    var $table = $(this).prev();
    $table.find('tr.first-half').last().clone(true).appendTo($table);
    $table.find('tr.second-half').last().clone(true).appendTo($table);
  })


  function create_context() {
    var context = {
      hometeam: [],
      awayteam: []
    }

    // Grab all the general stuff
    assign_values(context, '.general');

    // Grab Home team - .next is a hack
    $('.home').next().find('tr.first-half').each(function(i, el) {
      var first = assign_values({}, el);
      var second = assign_values({}, $(el).next())
      var result = null;


      if(Object.keys(first).length > 1 && Object.keys(second).length > 1) {
        result = merge_values(first, second);
      } else {
        if(Object.keys(first).length > 1)
          result = first;
        if(Object.keys(second).length > 1)
          result = second;
      }

      if(result)
        context.hometeam.push(result);
    })

    // Grab Away team - .next is a hack
    $('.away').next().find('tr.first-half').each(function(i, el) {
      var first = assign_values({}, el);
      var second = assign_values({}, $(el).next())
      var result = null;

      if(Object.keys(first).length > 1 && Object.keys(second).length > 1) {
        result = merge_values(first, second);
      } else {
        if(Object.keys(first).length > 1)
          result = first;
        if(Object.keys(second).length > 1)
          result = second;
      }

      if(result)
        context.awayteam.push(result);
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
    return context;
  }

  function merge_values(first, second) {
    var result = {}
    result.name = first.name;
    result.position = first.position;
    result.minutes = first.minutes;
    result.score = parseInt(first.score, 10) + parseInt(second.score, 10)
    result.tags = parseInt(first.tags, 10) + parseInt(second.tags, 10)
    result.popped  = parseInt(first.popped, 10) + parseInt(second.popped, 10)
    result.grabs = parseInt(first.grabs, 10) + parseInt(second.grabs, 10)
    result.drops  = parseInt(first.drops, 10) + parseInt(second.drops, 10)
    result.captures = parseInt(first.captures, 10) + parseInt(second.captures, 10)
    result.returns = parseInt(first.returns, 10) + parseInt(second.returns, 10)
    result.support = parseInt(first.support, 10) + parseInt(second.support, 10)
    result.posneg = parseInt(first.posneg, 10) + parseInt(second.posneg, 10)
    return result;
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
