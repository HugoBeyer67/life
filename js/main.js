var Life = React.createClass({
  getInitialState: function(){
    return {table : [],
            player : "x",
            gameEnd : false,
            clickFlag : 0
            
  
  }
},
componentDidMount: function(){
  var generalTable = [];
  for(var i = 0; i<this.props.numberInY;i++){
    var ligne = [];
    for(var j = 0; j<this.props.numberInX;j++){
      var block = false;
      ligne.push(block);
    }
    generalTable.push(ligne);  
  }
  this.setState({
    table : generalTable
  });

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
    var newTable = this.state.table;
    newTable[i][j] = !this.state.table[i][j];
    this.setState({
      table : newTable
    });
    
    console.log(this.state.table[i][j]);
  },
  
  render: function(){
    //console.log("render 1");
    var morpion = [];
    var time = new Date();
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
    console.log(new Date()-time);
    return <div>{morpion}</div>;    
  }
});

ReactDOM.render(
  <div><Life numberInX="15" numberInY="15" /></div>,
  document.getElementById('container')
);
