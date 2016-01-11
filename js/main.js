var Life = React.createClass({
  getInitialState: function(){
    return {table : this.createTable(),
            clickFlag : 0,
            start : false,
            running : "Start",
            blockSize : 15,
            speed :100
            
  
  }
},

createTable: function(){
  var generalTable = [];
  for(var i = 0; i<this.props.numberInY;i++){
    var ligne = [];
    for(var j = 0; j<this.props.numberInX;j++){
      var block = false;
      ligne.push(block);
    }
    generalTable.push(ligne);  
  }
  
  return generalTable;
},
componentDidMount: function(){


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
    console.log("reset");
    var previous_size = this.state.blockSize;
    clearInterval(this.state.interval);
    this.setState(
      this.getInitialState() 
    );
    this.setState({
      blockSize : previous_size
    });
  },
  
  handleRange: function (event) {
    var speed = (event.target.value);
    this.changeSpeed(speed);
  },
  
  handleBlockSize: function (event) {
    var size_input_value = (event.target.value);
    this.setState({
      blockSize : size_input_value
    });
    console.log(this.state.blockSize);
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
            if(aliveFlag!=2&&aliveFlag!=3){
              newTable[i][j] = false;
              
            }
          }
          
          if(this.state.table[i][j]==false){
            if(aliveFlag==3){
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
        if(this.state.table[i][j]==false) var aliveOrDead = "dead";
        else var aliveOrDead = "alive";
        var classes = aliveOrDead+"_block block";
        var size = this.state.blockSize+'px';
    		var Case = <div key={i+"-"+j} className={classes} style={{width : size, height : size}} onClick={this.wantedBlock.bind(this,i,j)}>{this.state.table[i][j]}</div>;
    		ligne[j]=(Case);
    	}
    	morpion.push(<div key={i} className="ligne">{ligne}</div>);
    }
    return <div>
      <div className='panel'>
        <button name='start' className="start" onClick={this.handleStart}>{this.state.running}</button>
        <button onClick={this.handleReset}>Reset</button>
        <label for='range'>Speed</label>
        <input name='range' onChange={this.handleRange} type='range' min='0' max ='200'/>
        <label for='blockSize'>Block Size</label>
        <input name ='blockSize' type='number' value={this.state.blockSize} onChange={this.handleBlockSize} />
      </div>
      <div>{morpion}</div>
    </div>;    
  }
  
  
  
  
  
});

ReactDOM.render(
  <div><Life numberInX="20" numberInY="20" /></div>,
  document.getElementById('container')
);
