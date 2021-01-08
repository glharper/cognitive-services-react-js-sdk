import logo from './logo.svg';
import { Component } from 'react';
import './App.css';
import { AudioConfig, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const ResultForm = (props) => {
    return (
        <tr>
            <td align="right">{props.title}</td>
            <td align="left">
                <textarea 
                  id="phraseDiv" 
                  style={props.style}
                  >
                    {props.text}
                </textarea>
            </td>
        </tr>
      );
}

//Boilerplate element
const BP = (props) => {
    return (
      <></>
    );
}

const Title = (props) => {
    return (
      <tr>
          <td></td>
          <td align="left">
              <h1 style={{fontWeight:"500"}}>Speech Recognition</h1>
              <h2 style={{fontWeight:"500"}}>Microsoft Cognitive Services</h2>
          </td>
      </tr>
    );
}

const KeyForm = (props) => {
    return (
      <tr>
          <td align="right">
            <a 
              href="https://www.microsoft.com/cognitive-services/sign-up"
              target="_blank"
              rel="noreferrer">
                Subscription
              </a>:
          </td>
          <td>
            <input 
              key="random1"
              type="text" 
              size="40" 
              value={props.value}
              onChange={event => props.onChange(event.target.value)}
            />
          </td>
      </tr>
    );
}

class SpeechTable extends Component {
  constructor(props) {
    super(props);
    this.state = {results: "", events: "", subscriptionKey: "YOUR_SPEECH_API_KEY", recognizing: false};
    this.eventStyle = {display: "inline-block",width:"500px",height:"200px",overflow: "scroll",whiteSpace: "nowrap"};
    this.resultStyle = {display: "inline-block", width:"500px", height:"200px"};
  }

  updateKey = value => this.setState({ subscriptionKey: value });
  startRecognition = () => this.setState({ recognizing: true });
  endRecognition = () => this.setState({ recognizing: false });
  render () {
    return (
      <table>
        <Title />
        <KeyForm value={this.state.subscriptionKey} onChange={this.updateKey} />
          <tr>
              <td align="right">Language:</td>
              <td align="left">
                  <select id="languageOptions">
                      <option value="ar-EG">Arabic - EG</option>
                      <option value="ca-ES">Catalan - ES</option>
                      <option value="da-DK">Danish - DK</option>
                      <option value="da-DK">Danish - DK</option>
                      <option value="de-DE">German - DE</option>
                      <option value="en-AU">English - AU</option>
                      <option value="en-CA">English - CA</option>
                      <option value="en-GB">English - GB</option>
                      <option value="en-IN">English - IN</option>
                      <option value="en-NZ">English - NZ</option>
                      <option value="en-US" selected="selected">English - US</option>
                      <option value="es-ES">Spanish - ES</option>
                      <option value="es-MX">Spanish - MX</option>
                      <option value="fi-FI">Finnish - FI</option>
                      <option value="fr-CA">French - CA</option>
                      <option value="fr-FR">French - FR</option>
                      <option value="hi-IN">Hindi - IN</option>
                      <option value="it-IT">Italian - IT</option>
                      <option value="ja-JP">Japanese - JP</option>
                      <option value="ko-KR">Korean - KR</option>
                      <option value="nb-NO">Norwegian - NO</option>
                      <option value="nl-NL">Dutch - NL</option>
                      <option value="pl-PL">Polish - PL</option>
                      <option value="pt-BR">Portuguese - BR</option>
                      <option value="pt-PT">Portuguese - PT</option>
                      <option value="ru-RU">Russian - RU</option>
                      <option value="sv-SE">Swedish - SE</option>
                      <option value="zh-CN">Chinese - CN</option>
                      <option value="zh-HK">Chinese - HK</option>
                      <option value="zh-TW">Chinese - TW</option>
                  </select>
              </td>
          </tr>
          <tr>
              <td align="right">Region:</td>
              <td align="left">
                  <select id="regionOptions">
                      <option value="westus" selected="selected">West US</option>
                      <option value="westus2">West US2</option>
                      <option value="eastus">East US</option>
                      <option value="eastus2">East US2</option>
                      <option value="eastasia">East Asia</option>
                      <option value="southeastasia">South East Asia</option>
                      <option value="northeurope">North Europe</option>
                      <option value="westeurope">West Europe</option>
                  </select>
              </td>
          </tr>
          <tr>
              <td align="right">Input:</td>
              <td align="left">
                  <select id="inputSource">
                      <option value="Mic" selected="selected">Microphone</option>
                      <option value="File">Audio File</option>
                  </select>
              </td>
          </tr>
          <tr>
              <td></td>
              <td>
                  <input type="file" id="filePicker" accept=".wav" style={{display:"none"}} />
              </td>
          </tr>
          <tr>
              <td align="left"><b>Speech SDK API recognizeOnceAsync:</b></td>
              <td>
                  <button id="speechsdkStartRecognizeOnceAsync">recognizeOnceAsync()</button>
                  <button id="speechsdkStopRecognizeOnceAsync" disabled="disabled">STOP recognizeOnceAsync()</button>
              </td>
          </tr>
          
          <ResultForm title="Results:" text={this.state.results} style={this.resultStyle}/>
          <ResultForm title="Events:" text={this.state.events} style={this.eventStyle}/>
      </table>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <SpeechTable />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
