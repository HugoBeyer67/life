var Life = React.createClass({
  getInitialState: function(){
    return {table : this.createTable(),
            clickFlag : 0,
            start : false,
            
  
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
  
  // createLigne: function (ligne,l_index) {
  //     return <div className="ligne">{ligne.map(this.createCase(l_index))}</div>
  // },
  // createCase:function(l_index){
  //   return function (block, b_index) {
  //       //console.log(l_index, b_index);
  //       return <div className="block" data-l-index={l_index} data-b-index={b_index} onClick={this.wantedBlock}>{block}</div>
  //   }.bind(this);
  // },
  wantedBlock: function (i, j) {
    // var playerTarget = event.target;
    // var targetLineIndex = playerTarget.getAttribute("data-l-index");
    // var targetBlockIndex = playerTarget.getAttribute("data-b-index");
    var clickTable = this.state.table;
    clickTable[i][j] = !this.state.table[i][j];
    this.setState({
      table : clickTable
    });
  },
  handleClick: function (event) {
    this.setState({start : !this.state.start})
    console.log(this.state.start);
    setInterval(this.checkRules.bind(this), 100);
  },
  
  checkRules: function () {
    console.log("checkRules START");
    if(this.state.start == true){
      var newTable = _.clone(this.state.table, true);
      for(var i = 0; i < this.state.table.length ; i++){
        for(var j = 0; j < this.state.table[i].length; j++){
          console.log("checkRules TRUE");
          var aliveFlag = this.checkAround(i,j);
          console.log("aliveFLag : "+aliveFlag);
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
          
          //console.log("render second loop");
          
          // this.state.table[i][j]==true alive
          // compter le nombre de voisin vivants autour:
          
        }
      }
      console.log(newTable);
      this.setState({table : newTable});    
    }
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
        var classes = aliveOrDead+"_block";
    		var Case = <div key={i+"-"+j} className={classes} onClick={this.wantedBlock.bind(this,i,j)}>{this.state.table[i][j]}</div>;
    		ligne[j]=(Case);
    	}
    	morpion.push(<div key={i} className="ligne">{ligne}</div>);
    }
    return <div>{morpion}<button className="start" onClick={this.handleClick}>Start</button></div>;    
  }
  
  
  
  
  
});

ReactDOM.render(
  <div><Life numberInX="15" numberInY="15" /></div>,
  document.getElementById('container')
);
