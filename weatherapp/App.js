import React from 'react';
import {TouchableOpacity ,StyleSheet,TextInput,Text,View,Alert,Image, Button} from 'react-native';
import {Overlay,} from 'react-native-elements';
 import {vw, vh, Dimensions} from 'react-native-viewport-units'



export default class App extends React.Component {

  state={name_new:"",selectedcity:false,cityname:"default",location:{},apikey:'AIzaSyBlenci9g0C_166b8sMDxbQ78XFGsr0iSk',forecast:{"0":{},"1":{},"2":{},"3":{}},isVisible:false,predictions:[],dayNames : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],monthNames :['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November', 'December'],day:"",hour:0,minutes:0,sec:0,current_temp:0}

  
  componentDidMount() {
    this.findlocation();
    this.displaydate()

  }

 

  findlocation = () => {

      navigator.geolocation.getCurrentPosition(
        position => {
          const location = JSON.stringify(position);
          this.setState({location:position.coords});
          this.getweathernow()
          this.getweatherforecast()

        },
        error => Alert.alert(error.message)
      ,options = {
        enableHighAccuracy: true,
        maximumAge : 60000,
        timeout : 45000
      }
      )

  };

  displaydate= ()=>{

    setInterval(async ()=>{ 
      try{
      const d= await new Date()
      this.setState({d}) 
      const minutes= await d.getMinutes()
      this.setState({minutes})
      const num_day= await d.getDay()
      this.setState({num_day})
      const num_month=await d.getMonth()
      this.setState({num_month})
      const day=await d.getDate()
      this.setState({day})
      const hour=await d.getHours()
      this.setState({hour})
      const sec=await d.getSeconds()
      this.setState({sec})}
      catch(error){console.error(error)}
  
  },1000)


  }

  getweathernow= async ()=>{
    try{
      
   const data= await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&units=metric&APPID=356f4c5c820f76f0f739f20caef2afbf`)
    const datajson=  await data.json();


    const {name}=datajson
    const {temp}=datajson.main
    const {icon}=datajson.weather[0]
    const {description}=datajson.weather[0]
    this.setState({data:datajson})
    this.setState({name:name})
    this.setState({current_temp:temp})
    this.setState({current_icon:icon})
    this.setState({desc:description})
  }
  catch(err){console.error(err)}

  }
 getweatherforecast= async ()=>{
  let tmp,tmp1=[]
  let forecast={}
  let counter=1;
  const d= new Date()
  const num_day=d.getDate()
  let name_day=d.getDay()
  dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursdy', 'Friday', 'Saturday']
  const data= await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${this.state.location.latitude}&lon=${this.state.location.longitude}&units=metric&APPID=356f4c5c820f76f0f739f20caef2afbf`)
  const datajson=  await data.json();
  let flag=true
  let forecast_index=-1
  datajson.list.map((item,index)=>{
    tmp=item.dt_txt.split(" ")
    tmp1=tmp[0].split("-")
     if(num_day!=tmp1[2]){
      if(counter===1){
        forecast_index++
      }
     if(counter===1&&flag===true){
         forecast[forecast_index]={}
         forecast[forecast_index]["temp"]=[]        
      }
      if(counter===6){
          forecast[forecast_index]["icon"]=item.weather[0].icon
      }
      forecast[forecast_index]["temp"].push(item.main.temp)
       counter++
       if(counter===9){
          name_day++
            if(name_day===7){
               name_day=0;
             }
          forecast[forecast_index]["day"]=dayNames[name_day]
          flag===false
          counter=1;
          forecast[forecast_index]["temp_min"]=Math.min(...forecast[forecast_index]["temp"])
          forecast[forecast_index]["temp_max"]=Math.max(...forecast[forecast_index]["temp"])
        }  
     }

  })

  this.setState({forecast:forecast})
  this.state.forecast[0].temp
}



findcity= async (name_new)=>{
  
  this.setState({name_new})

 
  try{
    const data= await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${name_new}&types=(cities)&key=${this.state.apikey}`)

  const datajson= await data.json()
  const predictions= datajson.predictions;
  this.setState({predictions})

  }
  catch(err){console.error(err)}
}

getcitylocation= async (place_id)=>{
  

 
  try{
    const data= await fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${place_id}&key=${this.state.apikey}`)

  const datajson= await data.json()
  const location= datajson.results;
  const latitude=location[0].geometry.location.lat
  const longitude=location[0].geometry.location.lng
  this.setState({location:{latitude,longitude}})

  }
  catch(err){console.error(err)}
}


displayforecast=()=>{

 return <View style={styles.thirdpart}>

  <View style={styles.forecast}><Text style={{textAlign:'center'}}>{this.state.forecast[0].day}</Text><Image style={{width: 80, height: 80}} source={{uri:('http://openweathermap.org/img/wn/'+this.state.forecast[0].icon+'@2x.png')}}></Image><Text style={{textAlign:'center'}}>{this.state.forecast[0].temp_min} °C min</Text><Text style={{textAlign:'center'}}>{this.state.forecast[0].temp_max} °C max</Text></View>
  <View style={styles.forecast}><Text style={{textAlign:'center'}}>{this.state.forecast[1].day}</Text><Image style={{width: 80, height: 80}} source={{uri:('http://openweathermap.org/img/wn/'+this.state.forecast[1].icon+'@2x.png')}}></Image><Text style={{textAlign:'center'}}>{this.state.forecast[1].temp_min} °C min</Text><Text style={{textAlign:'center'}}>{this.state.forecast[1].temp_max} °C max</Text></View>
  <View style={styles.forecast}><Text style={{textAlign:'center'}}>{this.state.forecast[2].day}</Text><Image style={{width: 80, height: 80}} source={{uri:('http://openweathermap.org/img/wn/'+this.state.forecast[2].icon+'@2x.png')}}></Image><Text style={{textAlign:'center'}}>{this.state.forecast[2].temp_min} °C min</Text><Text style={{textAlign:'center'}}>{this.state.forecast[2].temp_max} °C max</Text></View>
  <View style={styles.forecast}><Text style={{textAlign:'center'}}>{this.state.forecast[3].day}</Text><Image style={{width: 80, height: 80}} source={{uri:('http://openweathermap.org/img/wn/'+this.state.forecast[3].icon+'@2x.png')}}></Image><Text style={{textAlign:'center'}}>{this.state.forecast[3].temp_min} °C min</Text><Text style={{textAlign:'center'}}>{this.state.forecast[3].temp_max} °C max</Text></View>
      </View>


 }


 selectCity=(cityname,place_id)=>{
   this.setState({name_new:cityname})
   this.getcitylocation(place_id)
   this.setState({name:cityname})
   this.getweathernow()
   this.getweatherforecast()

 }
 
applySelectedCity=()=>{
  this.getweathernow()
  this.getweatherforecast()
  this.setState({isVisible:false})

}

  render() {
    return ( 
    <View style={styles.container}>        
        <View style={styles.firstrow}>
              <TouchableOpacity onPress={this.findlocation}><Image style={{width: 30, height: 30}} source={require('./photos/gps.png')}/></TouchableOpacity>
              <View style={{flex:1, flexDirection: 'row', justifyContent:'center'}}><Text>{this.state.day+' '+this.state.monthNames[this.state.num_month]+' / '+this.state.dayNames[this.state.num_day]}</Text><Text>{'    '+this.state.hour+' : '+this.state.minutes+' '}</Text></View>

        </View>
        <View style={styles.secondpart}>
            <Text style={{fontSize:30}}>{this.state.name}</Text><Button title="Search" onPress={() => this.setState({isVisible:true})}></Button>
            <Overlay style={styles.overlay} isVisible={this.state.isVisible} width="80%" height='auto' >
                <Button title="Cancel" onPress={() => this.setState({isVisible:false})}></Button>              
                <Text style={{fontSize:20,paddingHorizontal:80}}>Enter a city</Text>
                <View style={styles.searchpart}>
                    <TextInput  value={this.state.name_new} style={{width:'100%', backgroundColor:'#e6e6e6', height:40}}   onChangeText={(name_new)=>this.findcity(name_new)}  placeholder="serach here" /><View style={{width:'20%'}}><Button onPress={()=>this.applySelectedCity()} title="Go!"></Button></View>
                </View>  
                <View>{this.state.predictions.map((item,index)=><Text style={styles.listitems} onPress={()=>{this.selectCity(item.description,item.place_id)}}  title={item.description} key={index}>{item.description}</Text>)}</View>               
            </Overlay>
            <Text style={{paddingTop:'2%'}}>{this.state.current_temp+' °C - actual'}</Text>
            <Image style={{width: 80, height: 80}} source={{uri:('http://openweathermap.org/img/wn/'+this.state.current_icon+'@2x.png')}}/>
            <Text>{this.state.desc}</Text>
        </View>
          {this.displayforecast()}   
    </View>
    );
}
}
const styles = StyleSheet.create({
  container: {
   flex:1,
    backgroundColor: '#ffe2b3',
    paddingLeft:10,
    paddingRight:10,
     height:100*vh,
     position: 'relative'
 
   
  },
  firstrow:{
  marginTop:40,
  paddingBottom:20,
  flexDirection: 'row',
  justifyContent: 'space-between',
  height:8*vh
    
  },
  secondpart:{
        alignItems: 'center',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        height:35*vh

  },
  thirdpart:{
     flex: 1,
     flexDirection: 'row',
     justifyContent: 'space-between',
    alignItems: 'center',
     flexWrap:'wrap',
    height:60*vh,
  },
  forecast:{
    padding:'2%'
  }
  ,
  overlay:{

    backgroundColor:'white'
  }
  ,
  listitems:{
    padding:4,
    borderBottomWidth:0.5,
    borderBottomColor:'#e6e6e6'
  }
  ,
  searchpart:{


  }

});
