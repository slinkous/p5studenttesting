$(document).ready(function(){

  $.ajax({
    url: "sidescroll.js",
    success: function(result){
      var sketch = new Sketch(result);
      // sketch.parse(result);
      sketch.getAllVariables();
      var tests = [];
      var data = {
        sketch: sketch,
        subject: "variable",
        type: "object",
        name: "player"
      }
      tests.push(new Assertion(data));
      data = {
        sketch: sketch,
        subject: "variable",
        type: "object",
        name: "sun"
      }
      tests.push(new Assertion(data));
      data = {
        sketch: sketch,
        subject: "variable",
        type: "number",
        name: "ground",
        value: 350
      }
      tests.push(new Assertion(data));
      for(var t of tests){
        console.log(t.describe());
        console.log(t.test());
      }
      // console.log(sketch)
    }
  })
})
