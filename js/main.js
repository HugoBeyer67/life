var Life = React.createClass({
  getInitialState: function(){
    return { numberInY : 20,
            numberInX : 20,
            table : [],
            clickFlag : 0,
            start : false,
            startButtonLabel : "Start",
            blockSize : 15,
            speed :100,
            livingGround : 2,
            livingCeiling : 3,
            birthRule :3,
            stepsTable : [],
            stepsCount : 0

  }
},
//checkKey for rewind or going 'forward in time'. Event attached to the document
checkKey:function(e){
  e = e || window.event;
  var previousIndex = 0;
  var previousTable = [];
  if (e.keyCode == '37' && this.state.stepsCount > 0) {
    //left arrow
     previousIndex = this.state.stepsCount - 1;
     previousTable = this.state.stepsTable[previousIndex];
     clearInterval(this.state.interval);
     this.setState({
       start : false,
       startButtonLabel : "Start",
       table : previousTable,
       stepsCount : previousIndex
     });
  }
  else if (e.keyCode == '39') {
    //right arrow
    clearInterval(this.state.interval);
    this.runStep();
    this.setState({
      start : false,
      startButtonLabel : "Start"
    });
  }
},


//creates an empty table
createTable: function(){
  var generalTable = [];
  for(var i = 0; i<this.state.numberInY;i++){
    var ligne = [];
    for(var j = 0; j<this.state.numberInX;j++){
      var block = false;
      ligne.push(block);
    }
    generalTable.push(ligne);
  }

  return generalTable;
},

//creates a random table
createRandomTable: function(){
  var generalTable = [];
  for(var i = 0; i<this.state.numberInY;i++){
    var ligne = [];
    for(var j = 0; j<this.state.numberInX;j++){
      var randomVal = Math.round(Math.random());
      if(randomVal == 0){
        var block = false;
      }
      else{
        var block = true;
      }
      ligne.push(block);
    }
    generalTable.push(ligne);
  }

  this.setState({
    table : generalTable,
    startButtonLabel : "Start",
    start : false
  });  
  clearInterval(this.state.interval);
  
},

// when component did mount create an empty table
componentDidMount: function(){
  this.setState({
    table : this.createTable()
  });
},

//attach the keydown event to the document (checkey -> going back and forth in time)
componentWillMount:function(){
   document.addEventListener("keydown", this.checkKey);
 },
 
//handles the click of a cell in the table, replaces the existing table by the new table containing clicked cells
wantedBlock: function (i, j) {
  var clickTable = this.state.table;
  clickTable[i][j] = !this.state.table[i][j];
  this.setState({
    table : clickTable
  });
},

//Plays or Pauses the game  
handlePlayPause: function () {
  var invertStart = !this.state.start;
  this.setState({start: invertStart});
  this.handleInterval(invertStart);

},

runStep: function () {
    var newTable = _.clone(this.state.table, true);
    var newStepsTable = _.clone(this.state.stepsTable, true);
    var newStepsCount = this.state.stepsCount + 1;

    newStepsTable.push(this.state.table);
    for(var i = 0; i < this.state.table.length ; i++){
      for(var j = 0; j < this.state.table[i].length; j++){
        var aliveFlag = this.checkAround(i,j);
        if(this.state.table[i][j]==true){
          if(aliveFlag!=this.state.livingGround&&aliveFlag!=this.state.livingCeiling){
            newTable[i][j] = false;

          }
        }

        if(this.state.table[i][j]==false){
          if(aliveFlag==this.state.birthRule){
            newTable[i][j] = true;
          }
        }

      }
    }


    this.setState({
      stepsTable : newStepsTable,
      stepsCount : newStepsCount, 
      table : newTable  
    });    
},

// check the rules around a cell, counts the number of 'alive' cells around
checkAround: function(i,j) {
  var aliveFlag = 0;
  if(i>0&&j>0&&this.state.table[i-1][j-1]==true) aliveFlag++;
  if(i>0&&this.state.table[i-1][j]==true) aliveFlag++;
  if(i>0&&j<this.state.table[i].length-1&&this.state.table[i-1][j+1]==true) aliveFlag++;
  if(j>0&&this.state.table[i][j-1]==true) aliveFlag++;
  if(j<this.state.table[i].length-1&&this.state.table[i][j+1]==true) aliveFlag++;
  if(i<this.state.table.length-1&&j>0&&this.state.table[i+1][j-1]==true) aliveFlag++;
  if(i<this.state.table.length-1&&this.state.table[i+1][j]==true) aliveFlag++;
  if(i<this.state.table.length-1&&j<this.state.table[i].length-1&&this.state.table[i+1][j+1]==true) aliveFlag++;

  return aliveFlag;
},

//handles the interval that are running the game
handleInterval: function (start){
  if(start == true){
    this.setState({
      //The game is running
      interval : setInterval(this.runStep, this.state.speed),
      startButtonLabel : "Pause",
    });
  }
  if(start == false){
    //the game is on pause
    clearInterval(this.state.interval);
    this.setState({
      startButtonLabel : "Start"
    });
  }
},

handleReset: function () {
  //save the states we want to keep after reset
  var previous_size = this.state.blockSize;
  var previous_x = this.state.numberInX;
  var previous_y = this.state.numberInY;
  var previous_livingGround = this.state.livingGround;
  var previous_livingCeiling = this.state.livingCeiling;
  var previous_birthRule = this.state.birthRule;
  //resets
  clearInterval(this.state.interval);
  this.setState(
    this.getInitialState()
  );
  //creates table
  this.componentDidMount();
  //set the new states with previous values
  this.setState({
    blockSize : previous_size,
    numberInX : previous_x,
    numberInY : previous_y,
    livingGround : previous_livingGround,
    livingCeiling : previous_livingCeiling,
    birthRule :previous_birthRule
  });
},

handleSpeed: function (event) {
  var speed = (event.target.value);
  this.changeSpeed(speed);
},

changeSpeed: function (speed) {
  var difference = speed - 100;
  var realSpeed = 100 - difference;
  
  //clears the current interval, then set a new interval with the new speed
  clearInterval(this.state.interval);
  
  if(this.state.start==true){
    this.setState({
      interval : setInterval(this.runStep, realSpeed),
      speed : realSpeed
    });
  }
  else{
    this.setState({
      speed : realSpeed
    });
  }
},

//handle the number of cells in X
handleTableSizeX: function (event) {
  var table_size_x_save = (event.target.value);
  this.handleReset();
  this.setState({
    numberInX : table_size_x_save
  });
},

//handle the number of cells in Y
handleTableSizeY: function (event) {
  var table_size_y_save = (event.target.value);
  this.handleReset();
  this.setState({
    numberInY : table_size_y_save
  });

},

//change the displayed size of the blocks (in css)
handleBlockSize: function (event) {
  var size_input_value = (event.target.value);
  this.setState({
    blockSize : size_input_value
  });
},


// Rules of the game

handleBirthRule: function (event) {
  var current_birth_rule = (event.target.value);
  this.setState({
    birthRule : current_birth_rule
  });
},
handleLivingCeiling: function (event) {
  var current_value = (event.target.value);
  this.setState({
    livingCeiling : current_value
  });
},
  handleLivingGround: function (event) {
    var current_value = (event.target.value);
    this.setState({
      livingGround : current_value
    });
  },

  randomColor :function(){
    var colorTable = [0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F'];
    var colorName = '#';
    for(var i = 0;i<6; i++){
      var item = colorTable[Math.floor(Math.random()*colorTable.length)];
      colorName+=item;
    }
    return colorName;
  },

  chargePattern :function(pattern){
    switch (pattern) {
      case 'pulsar':
        var result = [[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,true,true,true,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,true,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]];
        this.setState({
          table : result,
          start : false,
          startButtonLabel : "Start"
        });
        clearInterval(this.state.interval);
        break;
      case 'glider':
      var result = [[false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[true,true,true,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]];
        this.setState({
          table : result,
          start : false,
          startButtonLabel : "Start"
        });
        clearInterval(this.state.interval);
        break;

        case 'weekender':
        var result = [[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,true,true,true,false,false,false,false,false,false,false,false,false,false,true,true,true,false,false],[false,true,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,true,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,true,false,false,false,false,false,false,false,false,true,false,false,false,false,false],[false,true,false,false,false,false,false,false,false,true,true,false,false,false,false,false,false,false,true,false],[false,false,false,true,true,true,false,false,true,false,false,true,false,false,true,true,true,false,false,false],[false,false,false,false,true,true,false,true,true,false,false,true,true,false,true,true,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false],[false,false,false,false,false,false,true,true,true,true,true,true,true,true,false,false,false,false,false,false],[false,false,false,false,false,false,false,true,false,true,true,false,true,false,false,false,false,false,false,false],[false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false,false]];
          this.setState({
            table : result,
            start : false,
            startButtonLabel : "Start"
          });
          clearInterval(this.state.interval);
          break;
    }
  },

  saveTable :function(){

    var dataObj = {
      'good': 'love',
      'bad': 'hate'
    };
    var jsonData = JSON.stringify(this.state.table);
    var blob = new Blob([jsonData], {type: "application/json; charset=utf-8"});
saveAs(blob, "save.json");
  },

  importTable :function(e){
    var file = e.target.files[0]
    if (file) {
      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = evt => {
          var result = JSON.parse(evt.target.result);
          this.setState({
            table : result
          });
      }
      reader.onerror = function (evt) {
          document.getElementById("fileContents").innerHTML = "error reading file";
        }
    }
  },

  render: function(){
    var morpion = [];
    for(var i = 0; i < this.state.table.length ; i++){
    	var ligne=new Array(this.state.table[i].length);
    	for(var j = 0; j < this.state.table[i].length; j++){
        if(this.state.table[i][j]==false){
          var blockColor = 'white';
          var aliveOrDead = "dead";
        }
        else{
          var aliveOrDead = "alive";
          var blockColor = this.randomColor();
        }
        var classes = aliveOrDead+"_block block";
        var size = this.state.blockSize+'px';

    		var Case = <div key={i+"-"+j} className={classes} style={{width : size, height : size, background : blockColor}} onClick={this.wantedBlock.bind(this,i,j)}>{this.state.table[i][j]}</div>;
    		ligne[j]=(Case);
    	}
    	morpion.push(<div key={i} className="ligne">{ligne}</div>);
    }
    return <div>
      <div className='panel'>
        <button name='start' id='start_pause_button' className="start" onClick={this.handlePlayPause}>{this.state.startButtonLabel}</button>
        <button onClick={this.handleReset}>Reset</button>
        <button onClick={this.createRandomTable}>Randomize</button>
        <label htmlFor='range'>Speed</label>
        <input name='range' onChange={this.handleSpeed} type='range' min='0' max ='200'/>
        <label htmlFor='blockSize'>Block Size</label>
        <input name ='blockSize' type='number' value={this.state.blockSize} onChange={this.handleBlockSize} />
        <label htmlFor='tableSizeX'>X:</label>
        <input name ='tableSizeX' type='number' value={this.state.numberInX} onChange={this.handleTableSizeX} />
        <label htmlFor='tableSizeY'>Y:</label>
        <input name ='tableSizeY' type='number' value={this.state.numberInY} onChange={this.handleTableSizeY} />
        <p className='rules'>The cell survives if it has between <input type='number' min='0' max='8' value={this.state.livingGround} onChange={this.handleLivingGround} /> and <input type='number' min='0' max='8' value={this.state.livingCeiling} onChange={this.handleLivingCeiling} /> living cells around it. A dead cell can ressurect if it has <input type='number' min='0' max='8' value={this.state.birthRule} onChange={this.handleBirthRule} /> cells arround it </p>
        <button className='saveTable' onClick={this.saveTable}>Save</button>
        <input type='file' onChange={this.importTable}/>
      </div>
      <div className='patterns'>
        <button onClick={this.chargePattern.bind(this,'pulsar')} >Pulsar</button>
        <button onClick={this.chargePattern.bind(this,'glider')} >Glider</button>
        <button onClick={this.chargePattern.bind(this,'weekender')} >Weekender</button>
      </div>
      <div className='infos'>
        INFOS :
        Right Arrow : go forward in time;
        Left Arrow : go back in time;
      </div>
      <div>{morpion}</div>
    </div>;
  }
});

ReactDOM.render(
  <div><Life/></div>,
  document.getElementById('container')
);
