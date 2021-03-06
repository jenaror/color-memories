import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./landing.css";
import axios from "axios";

function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length === 1) r = "0" + r;
  if (g.length === 1) g = "0" + g;
  if (b.length === 1) b = "0" + b;

  return "#" + r + g + b;
}

export default function Landing() {
  return (
    <Router>
      <div className="mainDiv">
        <Switch>
          <Route path="/submit">
            <Colorsquare />
            <EssayForm />
          </Route>
          <Route path="/thanks">
            <Thanks />
            {//<Footer />
}
          </Route>
          <Route path="/memory">
            <MemoryCollection />
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
class Homepage extends React.Component {
  render() {
    return (
      <div className="landingDiv">
        <div className="header">
          <h1>
            Memories, <span id="colorized">Colorized</span>
          </h1>
        </div>
        <div className="introBody">
          <p>
            Memories, Colorized is an effort to collect human memories and their
            connection to colors.
          </p>
          <p>
            Participants will be shown a randomly generated color and asked to
            write about a memory invoked by that color. Your response will be
            recorded and be publically available.
          </p>
          <p>
            Your memory can be as simple or as detailed as you want. Once you're
            ready, you can click the button below to share your memories, or if
            you need some inspiration first, you can browse previous
            submissions.
          </p>
        </div>
        <div className="formButton">
          <Link to="/submit" id="loadForm" className="buttonStyles">
            Write your own
          </Link>
        </div>
        <div className="collectionButton">
          <Link to="/memory" id="loadCollection" className="buttonStyles">
            Browse memories
          </Link>
        </div>
        <p className="discretion">
          <i>Responses are not moderated. Reader discretion is advised.</i>
        </p>
      </div>
    );
  }
}

var hexCode;
const colorGenerator = () => {
  let randomHue = Math.floor(Math.random() * 360);
  let randomLightness = Math.floor(Math.random() * 100);
  //let hslValue = `${randomHue}, 100, ${randomLightness}`;
  hexCode = HSLToHex(randomHue, 100, randomLightness);
  return `hsl(${randomHue}, 100%, ${randomLightness}%)`;
};

class Colorsquare extends React.Component {
  render() {
    const mystyle = {
      backgroundColor: `${colorGenerator()}`
    };
    return (
      <div className="colorWrapper">
        <div className="square" style={mystyle}></div>{" "}
        <div className="hexText">{hexCode}</div>
      </div>
    );
  }
}

const comboFunction = (color, desc) => {
  return { color: color, description: desc };
};

class EssayForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    let newMemory = comboFunction(hexCode, this.state.value);
    axios
      .post("https://www.memoriescolorized.com/memories/add", newMemory)
      .then(res => {
        console.log(res.data);
        window.location.replace("/thanks");
      });
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <textarea
          name="memoryInput"
          id="mainInput"
          cols="30"
          rows="7"
          placeholder="Input your memory here.."
          value={this.state.value}
          onChange={this.handleChange}
        />
        <input type="submit" value="Submit" className="buttonStyles" />
      </form>
    );
  }
}

class Thanks extends React.Component {
  render() {
    return (
      <div className="thanksMain">
        <h2>Thank you!</h2>
        <p>
          Thanks for participating in this project. From here you can read other
          submissions, or you can submit another memory.
        </p>
        {/*
        <p>
          You can visit my website below for my portfolio and other projects.
        </p>*/
  }
        <div>
          <Link to="/submit" id="loadForm" className="buttonStyles">
            Submit again
          </Link>
        </div>
        <Link to="/memory" id="loadCollection" className="buttonStyles">
          Browse memories
        </Link>
      </div>
    );
  }
}

class Footer extends React.Component {
  render() {
    return (
      <div className="footerInfo">
        <div className="contactInfo">
          <a href="http://jenaror.com" className="websiteLink">
            jenaror.com
          </a>
        </div>
      </div>
    );
  }
}

class MemoryCollection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hexElem: <div className="hexText">Loading...</div>,
      descElem: (
        <div className="memoryResponse">
          <p>Retrieving your memories.</p>
        </div>
      ),
      colorElem: null
    };
    this.handleEvent = this.handleEvent.bind(this);
  }
  getData() {
    axios.get("https://www.memoriescolorized.com/memories").then(response => {
      let counter = Math.floor(Math.random() * response.data.length);
      console.log(`Loading memory #${counter}`);
      let elemHex = (
        <div className="hexText">{response.data[counter].color}</div>
      );
      let elemDesc = (
        <div className="memoryResponse">
          <p>{response.data[counter].description}</p>
        </div>
      );
      let elemColor = {
        backgroundColor: `${response.data[counter].color}`
      };
      this.setState({
        hexElem: elemHex,
        descElem: elemDesc,
        colorElem: elemColor
      });
    });
  }
  handleEvent() {
    this.setState({ hexElem: <div className="hexText">Loading...</div> });
    this.getData();
  }

  componentDidMount() {
    this.getData();
  }
  render() {
    return (
      <div className="colorWrapper">
        <div className="square" style={this.state.colorElem}></div>{" "}
        {this.state.hexElem}
        {this.state.descElem}
        <div>
          <a onClick={this.handleEvent} id="loadForm" className="buttonStyles">
            Read some more{" "}
          </a>
        </div>
        <Link to="/submit" id="loadForm" className="buttonStyles">
          Submit your own{" "}
        </Link>
        <div>
          <Link to="/" id="loadForm" className="buttonStyles">
            Main page
          </Link>
        </div>
        <p className="discretion">
          <i>Responses are not moderated.</i>
        </p>
      </div>
    );
  }
}
/*grabColor(2).then(function(x) {
  let poop = { backgroundColor: `${x}` };
});
*/
