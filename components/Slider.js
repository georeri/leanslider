import {Range, getTrackBackground} from 'react-range';
import * as React from 'react';
import { useRouter } from 'next/router'
import socketClient from 'socket.io-client';

const STEP = 1;
const MIN = 0;
const MAX = 100;
const SERVER = "http://localhost:3000";

export default class Slider extends React.Component{
  
  state = {
      id:-1,
      values: [0],
      color: ["#FF0000"],
      flipped: false,
      socket: null,
    };     
  socket;  

  constructor(props) {
    super(props);
      if(props.sliderVal != undefined) {
        this.state.values = [props.sliderVal];
        this.state.id = props.id;
       
      }
  }

  componentDidMount(){
    if(this.state.values[0] === MAX)
    {
      this.setState({color: "#008080", flipped: true});
    }
    this.configureSocket();
  }

  configureSocket = () => {
    var socket = socketClient(SERVER);
    socket.on('connection', () => {
  
    });

    socket.on('valchange', data => {
      console.log('VALUECHANGE');
      console.log(data);
      console.log("MYID: " + this.state.id);
      if(data.sliderId === this.state.id)
        this.setState({values: [data.sliderVal]});
    });
    this.socket = socket;
}

  

  static async publishSliderUpdates(e) {
    const res = await fetch(`http://localhost:3000/publish/`, {
      method: "PUT",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({slider: e.state})
    });
    
  }



      
      
render() {
   
    return (
      <div>
        <Range
            values={this.state.values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={(values) => {
                if(values[0] == MAX ){
                    this.setState({values: values, color: "#008080", flipped: true});
                    Slider.publishSliderUpdates(this);
                }
                else if(values[0] == MIN){
                    this.setState({values: values, color: "#FF0000", flipped:false});
                    Slider.publishSliderUpdates(this);
                }
                else
                {
                    this.setState({values: values});
                    //Slider.publishSliderUpdates(this);
                }
                
            }}        
            renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: "36px",
                    display: "flex",
                    width: "1000px"
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: "5px",
                      width: "100%",
                      borderRadius: "4px",
                      background: getTrackBackground({
                        values: this.state.values,
                        //colors: ["#548BF4", "#ccc"],
                        colors: [this.state.color, this.state.color],
                        min: MIN,
                        max: MAX
                      }),
                      alignSelf: "center"
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  {...props}
                  style={{
                    ...props.style,
                    height: "42px",
                    width: "42px",
                    borderRadius: "4px",
                    backgroundColor: "#FFF",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: "0px 2px 6px #AAA"
                  }}
                >
                  <div
                    style={{
                      height: "16px",
                      width: "5px",
                      backgroundColor: isDragged ? "#548BF4" : "#CCC"
                    }}
                  />
                </div>
              )}
            />
            <output style={{ marginTop: "30px" }} id="output">
              {this.state.values[0].toFixed(1)}
            </output>
          </div>
        );
      }
    }
