var Life = React.createClass({
  getInitialState: function(){
    return { numberInY : 20,
            numberInX : 20,
            table : [],
            clickFlag : 0,
            start : false,
            running : "Start",
            blockSize : 15,
            speed :100,
            livingGround : 2,
            livingCeiling : 3,
            birthRule :3
            
  
  }
},

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
componentDidMount: function(){
  this.setState({
    table : this.createTable()
  });
},

  wantedBlock: function (i, j) {
    var clickTable = this.state.table;
    clickTable[i][j] = !this.state.table[i][j];
    this.setState({
      table : clickTable
    });
  },
  handleStart: function () {
    
    console.log("before "+this.state.start);
    var invertStart = !this.state.start;
    console.log("invertStart "+invertStart);
    this.setState({start: invertStart});
    console.log("after "+this.state.start);
    this.handleInterval(invertStart);

  },
  
  handleReset: function () {
    var previous_size = this.state.blockSize;
    var previous_x = this.state.numberInX;
    var previous_y = this.state.numberInY;
    var previous_livingGround = this.state.livingGround;
    var previous_livingCeiling = this.state.livingCeiling;
    var previous_birthRule = this.state.birthRule;
    clearInterval(this.state.interval);
    this.setState(
      this.getInitialState()
      
    );
    this.componentDidMount();
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
  
  handleTableSizeX: function (event) {
    var table_size_x_save = (event.target.value);
    this.handleReset();
    this.setState({
      numberInX : table_size_x_save
    });
  },
    handleTableSizeY: function (event) {
      var table_size_y_save = (event.target.value);
      this.handleReset();
      this.setState({
        numberInY : table_size_y_save
      });
      
  },
  
  handleBlockSize: function (event) {
    var size_input_value = (event.target.value);
    this.setState({
      blockSize : size_input_value
    });
  },
  
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
  
  changeSpeed: function (speed) {
    var difference = speed - 100;
    var realSpeed = 100 - difference;
    clearInterval(this.state.interval);
    if(this.state.start==true){
      this.setState({
        interval : setInterval(this.checkRules, realSpeed),
        speed : realSpeed
      });      
    }
    else{
      this.setState({
        speed : realSpeed
      });        
    }

    
  },
  
  handleInterval: function (start){
    console.log("START : "+start);
    if(start == true){
      this.setState({
        interval : setInterval(this.checkRules, this.state.speed),
        running : "Pause"
      });
    }
    if(start == false){
      clearInterval(this.state.interval);
      this.setState({
        running : "Start"
      });
    }
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
  
  saveTable :function(){
    
  },
  
  checkRules: function () {
    console.log("interval Running");
    //console.log("checkRules START");
      var newTable = _.clone(this.state.table, true);
      for(var i = 0; i < this.state.table.length ; i++){
        for(var j = 0; j < this.state.table[i].length; j++){
          //console.log("checkRules TRUE");
          var aliveFlag = this.checkAround(i,j);
          //console.log("aliveFLag : "+aliveFlag);
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
      //console.log(newTable);
      this.setState({table : newTable});    
    
  },
  checkAround: function(i,j) {
    //console.log("checkAroundStart i: "+i+" j: "+j);
    //console.log("x-length : "+this.state.table.length+" y-length : "+this.state.table[i].length);
    //if(i>0&&j>0&&i<this.state.table.length&&j<)
    var aliveFlag = 0;
    if(i>0&&j>0&&this.state.table[i-1][j-1]==true) aliveFlag++;
    if(i>0&&this.state.table[i-1][j]==true) aliveFlag++;
    if(i>0&&j<this.state.table[i].length-1&&this.state.table[i-1][j+1]==true) aliveFlag++;
    if(j>0&&this.state.table[i][j-1]==true) aliveFlag++;
    if(j<this.state.table[i].length-1&&this.state.table[i][j+1]==true) aliveFlag++;
    if(i<this.state.table.length-1&&j>0&&this.state.table[i+1][j-1]==true) aliveFlag++;
    if(i<this.state.table.length-1&&this.state.table[i+1][j]==true) aliveFlag++;
    if(i<this.state.table.length-1&&j<this.state.table[i].length-1&&this.state.table[i+1][j+1]==true) aliveFlag++;
    //console.log("checkAroundEnd");
    
    return aliveFlag;
  },
  
  render: function(){
    //console.log("render 1");
    var morpion = [];
    //var time = new Date();
    for(var i = 0; i < this.state.table.length ; i++){
      //console.log("render First loop");
      
    	var ligne=new Array(this.state.table[i].length);
    	for(var j = 0; j < this.state.table[i].length; j++){
        //console.log("render second loop");
        if(this.state.table[i][j]==false){
          var blockColor = 'white';
          var aliveOrDead = "dead";
        } 
        else{
          var aliveOrDead = "alive"; 
          var blockColor = this.randomColor(); 
          console.log("block COlor : "+blockColor);
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
        <button name='start' className="start" onClick={this.handleStart}>{this.state.running}</button>
        <button onClick={this.handleReset}>Reset</button>
        <label htmlFor='range'>Speed</label>
        <input name='range' onChange={this.handleSpeed} type='range' min='0' max ='200'/>
        <label htmlFor='blockSize'>Block Size</label>
        <input name ='blockSize' type='number' value={this.state.blockSize} onChange={this.handleBlockSize} />
        <label htmlFor='tableSizeX'>X:</label>
        <input name ='tableSizeX' type='number' value={this.state.numberInX} onChange={this.handleTableSizeX} />
        <label htmlFor='tableSizeY'>Y:</label>
        <input name ='tableSizeY' type='number' value={this.state.numberInY} onChange={this.handleTableSizeY} />
        <p className='rules'>The cell survives if it has between <input type='number' min='0' max='8' value={this.state.livingGround} onChange={this.handleLivingGround} /> and <input type='number' min='0' max='8' value={this.state.livingCeiling} onChange={this.handleLivingCeiling} /> living cells around it. A dead cell can ressurect if it has <input type='number' min='0' max='8' value={this.state.birthRule} onChange={this.handleBirthRule} /> cells arround it </p>
      </div>
      <div>{morpion}</div>
    </div>;    
  }
  
  
  
  
  
});

ReactDOM.render(
  <div><Life/></div>,
  document.getElementById('container')
);
