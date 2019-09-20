$(document).ready(function(){

  $.ajax({
    url: "sketch2.js",
    success: function(result){
      var sketch = new Sketch(result);
      // sketch.parse(result);
      sketch.getAllVariables();
      var tests = [];
      var data = {
        sketch: sketch,
        subject: "shape",
        shape: "rect",
        qualifier: "exactly",
        verticalPos: "top",
        horizontalPos: "left"
      }
      tests.push(new Assertion(data));
      data.shape = "line"
      data.verticalPos = "bottom";
      tests.push(new Assertion(data));
      data.shape = "triangle"
      data.verticalPos = "top";
      data.horizontalPos = "right"
      tests.push(new Assertion(data));
      data.shape = "ellipse"
      data.verticalPos = "bottom";
      tests.push(new Assertion(data));
      for(var t of tests){
        console.log(t.describe());
        console.log(t.test());
      }
      // console.log(sketch)
    }
  })
})
