var shapeTypes = ["line", "rect", "ellipse", "triangle", "quad"];
var variableTypes = ["var", "const", "let"];
var allShapes = [];
var canvasSize = 500;
var allTests = []

class Sketch {
  constructor(code){
    this.shapes = [];
    this.lines = [];
    this.variables = [];
    this.functions = [];
    this.parse(code);
    this.getAllVariables();
    // console.log(this.shapes)
  }
  parse (stringifiedCode){
     this.lines = stringifiedCode.split("\n")
     this.getAllShapes();
  }
  getAllConditionals(){
    for(var i = 0; i < this.lines.length; i++){
      var l = this.lines[i].trim();
      var ifX = new RegExp(/(?<!else\s+)if\s*\(.+\)/)
      if(l.search(ifX) != -1){
        var fullStatement = l;
        var j = i + 1;
        var line = this.lines[j];
        var brackets = 1
        while(brackets != 0 && j < this.lines.length){
          // if(line.search("else") != -1){
          //   fullStatement +=
          // }
          fullStatement += "\n" + line.trim();

          if(line.search("{") != -1){
            brackets += line.match(/\{/g).length
          }
          if(line.search("}") != -1){
            brackets -= line.match(/\}/g).length
          }
          j++
          line = this.lines[j];
        }
      }
    }
  }
  getAllShapes(){
    for(var shape of shapeTypes){
      var shapeX = new RegExp(shape + '\\(.+\\)')
      for(var i = 0; i < this.lines.length; i++){
        var l = this.lines[i].trim();
        if (l.search(shapeX) != -1 ){
          this.shapes.push(new Shape({
            shape: shape,
            line: i,
            code: l
          }))
        }
      }
    }
  }
  getAllVariables(){
    for(var varT of variableTypes){
      var variableX = new RegExp( varT + '\\s\\w' )
      for(var i = 0; i < this.lines.length; i++){
        var l = this.lines[i].trim();
        var n = l.search(variableX)
        if (n === 0 ){
          var tempName = l.slice(varT.length+1);
          if(tempName.search(',') != -1 && tempName.search(/\(/) == -1){
            var names = tempName.split(',');
            for (var j = 0; j < names.length - 1; j++){
              this.variables.push({name:names[j].trim(), declaredOn: i});
            }
            tempName = names[names.length - 1].trim();
          }
          var end = tempName.search(/[\s\;]/)
          var name = tempName.slice(0, end)

          if (l.search("function") == -1){
            var foundVariable = {name: name, declaredOn: i}
            this.variables.push(foundVariable)
            this.defineVariable(foundVariable)
          } else {
              this.functions.push({name: name, declaredOn: i})
          }
        }
      }
    }
    // console.log(this.variables)
  }
  defineVariable(variable){
    var varX = new RegExp('\\b' + variable.name + '\\s*\\=[^\\=]')
    for(var i = 0; i < this.lines.length; i++){
      var l = this.lines[i]
      if(l.search(varX) != -1){
        var equLoc = l.search("=");
        var semiLoc = l.search(";")
        var val = l.slice(equLoc + 1, semiLoc).trim()

        if(val.search(/^\d+/) != -1){
          // console.log(val)
          val = parseInt(val)
          variable.dataType = "number"
        }
        if(val == "true" || val == "false"){
          variable.dataType = "boolean";
          val == "true" ? val = true : val = false;
        }
        variable.lastValue = val;

      }

      if(variable.lastValue == "["){
        var brackets = 1;
        var j = i + 1;
        while(brackets != 0 && j < this.lines.length){
          var currentLine = this.lines[j];
          if(currentLine.search(/\[/) != -1){
            brackets += currentLine.match(/\[/g).length;
          }
          if(currentLine.search(/\]/) != -1){
            brackets -= currentLine.match(/\]/g).length;
          }
          variable.lastValue += currentLine.trim();
          j++
        }
        variable.dataType = "array"
      }
      if(variable.lastValue == "{"){
        var brackets = 1;
        var j = i + 1;
        while(brackets != 0 && j < this.lines.length){
          var currentLine = this.lines[j];
          if(currentLine.search(/\{/) != -1){
            brackets += currentLine.match(/\{/g).length;
          }
          if(currentLine.search(/\}/) != -1){
            brackets -= currentLine.match(/\}/g).length;
          }
          variable.lastValue += currentLine.trim();
          j++
        }
        variable.dataType = "object"
      }

      // console.log(variable)
    }
  }
}

class Shape {
  constructor(data){
    this.shape = data.shape;
    this.line = data.line;
    this.code = data.code;
    this.params = {};
    this.getCoordinates();
    // this.analyzeParams();
    // allShapes.push(this);
  }
  getCoordinates(){
    var params = this.code.slice(this.code.search(/\(/) + 1, this.code.search(/\)/)).split(',')
    if(this.shape == "rect" || this.shape == "ellipse"){
      this.params.x = parseInt(params[0]);
      this.params.y = parseInt(params[1]);
      this.params.width = parseInt(params[2]);
      this.params.height = parseInt(params[3]);
    } else {
      for(var i = 0; i < params.length/2; i += 1){
        var propX = "x" + (i+1);
        var propY = "y" + (i+1);
        this.params[propX] = parseInt(params[i*2]);
        this.params[propY] = parseInt(params[i*2 + 1]);
      }
      if(params.length % 2 == 1){
        this.params.radius = parseInt(params.pop())
      }
    }
    return this
  }
  analyzeParams(){
    var analysis = {
      rawNumber: 0,
      math: 0,
      variable: 0
    }
    var description = "no description"
    for (var p in this.params){
      if(/[a-z]+/i.test(this.params[p])){
        analysis.variable += 1;
      }
      if(/[\+\-\/\*]/.test(this.params[p])){
        analysis.math += 1;
      }
      if(!/\D+/.test(this.params[p])){
        analysis.rawNumber += 1;
      }
    }
    // if(analysis.variable > 0){
    //   if(analysis.math > 0){
    //     description = "uses variables and mathematical operations"
    //   } else {
    //     description = "uses variables"
    //   }
    // } else if (analysis.math > 0){
    //   description = "uses mathematical operations"
    // } else {
    //   description = "uses only numbers"
    // }
    // console.log(description);
  }
  parseLocation(){
    // var location = "In the ";
    // var horizontalPos, verticalPos
    var centerX;
    var centerY;
    if(this.shape == "ellipse"){
      centerX = this.params.x;
      centerY = this.params.y;
    } else if (this.shape == "rect"){
      centerX = this.params.x + this.params.width/2;
      centerY = this.params.y + this.params.height/2;
    } else if (this.shape == "line"){
      centerX = (this.params.x1 + this.params.x2) / 2;
      centerY = (this.params.y1 + this.params.y2) / 2;
    } else if (this.shape == "triangle"){
      centerX = (this.params.x1 + this.params.x2 + this.params.x3) / 3;
      centerY = (this.params.y1 + this.params.y2 + this.params.y3) / 3;
    } else {
      console.log("Can only determine position for shapes")
      return;
    }
    console.log(centerX)
    if(typeof(centerX + centerY) != "number"){
      console.log("Can only determine position for shapes with number parameters");
      return;
    }
    if(centerX < canvasSize/3){
      this.horizontalPos = "left";
    } else if (centerX > 2*canvasSize/3){
      this.horizontalPos = "right";
    } else {
      this.horizontalPos = "center"
    }
    if(centerY < canvasSize/3){
      this.verticalPos = "top";
    } else if (centerY > 2*canvasSize/3){
      this.verticalPos = "bottom";
    } else {
      this.verticalPos = "center"
    }

  }
}

class Assertion {
  constructor(data){
    this.sketch = data.sketch;
    if(data.subject == "variable"){
      this.addVariable(data);
    }else if(data.subject == "shape"){
      this.addShape(data);
    }
    // allTests.push(this);
  }
  addShape(data){
    this.subject = "shape";
    this.shape = data.shape || "any";
    this.quantity = data.quantity || 1;
    this.qualifier = data.qualifier || "at least";
    //qualifiers: at least, exactly, no more than
    this.horizontalPos = data.horizontalPos || null;
    this.verticalPos = data.verticalPos || null;
  }
  addVariable(data){
    this.subject = "variable";
    this.type = data.type || null;
    this.name = data.name || null;
    this.value = data.value || null;
  }
  describe(){
    var descString;
    if(this.subject == "shape"){
        descString = "Contains " + this.qualifier + " " + this.quantity + " "+ this.shape
        if(this.horizontalPos || this.verticalPos){
          descString += " in the "
          if(this.verticalPos){
            descString += this.verticalPos;
          }
          if(this.horizontalPos && this.horizontalPos != this.verticalPos){
            descString += " " + this.horizontalPos;
          }
        }
    } else if(this.subject == "variable"){
      descString = "Includes a "
      if(this.type){
        descString += this.type + " "
      }else {
        descString += "variable "
      }
      if(this.name){
        descString += "called " + this.name + " "
      }
      if(this.value){
        descString += "with a value of " + this.value
      }
    }
    return descString
  }
  testShape(){
    var q = 0;
    for(var shape of this.sketch.shapes){
      if(shape.shape == this.shape || this.shape == "any"){
        if(this.horizontalPos || this.verticalPos){
          shape.parseLocation();

          if(this.horizontalPos && this.verticalPos){
            if(this.horizontalPos == shape.horizontalPos && this.verticalPos == shape.verticalPos){
              q += 1
            }
          }
        } else {
          q += 1
        }
      }
    }
    // console.log(q)
    var result;
    if(this.qualifier == "exactly"){
      return(q == this.quantity)
    }else if (this.qualifier == "no more than"){
      return(q <= this.quantity)
    } else {
      return(q >= this.quantity)
    }
  }
  testVariable(){
    // console.log(this)
    for(var v of this.sketch.variables){
      if(this.name){
        if(this.value){
          if(v.name == this.name && v.lastValue == this.value){
            return true;
          }
        } else {
          if(v.name == this.name){
            return true;
          }
        }
      } else if(this.type){
            // console.log(v.type);
        if(v.dataType == this.type){
          return true;
        }
      }
    }
    return false;
  }
  test(){
    if(this.subject == "shape"){
      return(this.testShape());
    } else if (this.subject == "variable"){
      return(this.testVariable());
    }
  }

}
// console.log($("#testform").text)
//
// $(document).ready(function(){
//   $("#subjectdialogue").hide();
//   console.log($("#subjectdialogue"))
//   $("#addtest").click(function(){
//     $("subjectdialog").show();
//     console.log($("subjectdialog"))
//   })
//   $("#subject").change(function(){
//     console.log($(this).val())
//   })
//   $("#testform").submit(function(event){
//     event.preventDefault();
//     var formData = $(this).serializeArray();
//     var url = formData.find(function(obj){
//       return obj.name == "url"
//     }).value
//     var testSubject = formData.find(function(obj){
//       return obj.name == "subject"
//     }).value
//     // console.log(formData)
//     var formObject = {};
//     for(var o of formData){
//       formObject[o.name] = o.value
//     }
//     // console.log(formObject)
//     $.ajax({
//       url: url,
//       success: function(result){
//         var sketch = new Sketch(result);
//         // sketch.parse(result);
//         sketch.getAllVariables();
//         formObject.sketch = sketch
//         var test1 = new Assertion(formObject);
//         // console.log(test1.describe())
//         // console.log(test1.test())
//         // console.log(test1);
//         // console.log(test1.describe())
//         // console.log(test1.test());
//         // var test2 = new Assertion(sketch);
//         // test2.addVariable({type:"object", name: "player"});
//         // console.log(test2)
//         // console.log(test2.describe())
//         // console.log(test2.test())
//       }
//     })
//   })
//
// })
