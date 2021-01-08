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

const LanguageOptions = (props) => {
    const languageOptions = [
      {val:"en-US", name:"English - US"},
      {val:"ar-EG", name:"Arabic - EG"},
      {val:"ca-ES", name:"Catalan - ES"},
      {val:"da-DK", name:"Danish - DK"},
      {val:"da-DK", name:"Danish - DK"},
      {val:"de-DE", name:"German - DE"},
      {val:"en-AU", name:"English - AU"},
      {val:"en-CA", name:"English - CA"},
      {val:"en-GB", name:"English - GB"},
      {val:"en-IN", name:"English - IN"},
      {val:"en-NZ", name:"English - NZ"},
      {val:"es-ES", name:"Spanish - ES"},
      {val:"es-MX", name:"Spanish - MX"},
      {val:"fi-FI", name:"Finnish - FI"},
      {val:"fr-CA", name:"French - CA"},
      {val:"fr-FR", name:"French - FR"},
      {val:"hi-IN", name:"Hindi - IN"},
      {val:"it-IT", name:"Italian - IT"},
      {val:"ja-JP", name:"Japanese - JP"},
      {val:"ko-KR", name:"Korean - KR"},
      {val:"nb-NO", name:"Norwegian - NO"},
      {val:"nl-NL", name:"Dutch - NL"},
      {val:"pl-PL", name:"Polish - PL"},
      {val:"pt-BR", name:"Portuguese - BR"},
      {val:"pt-PT", name:"Portuguese - PT"},
      {val:"ru-RU", name:"Russian - RU"},
      {val:"sv-SE", name:"Swedish - SE"},
      {val:"zh-CN", name:"Chinese - CN"},
      {val:"zh-HK", name:"Chinese - HK"},
      {val:"zh-TW", name:"Chinese - TW"}
    ];
    return (
      <>
        {languageOptions.map(opt => <option value={opt.val}>{opt.name}</option>)}
      </>
    );
}

const RegionOptions = (props) => {
    const regionOptions = [
      {val:"westus", name:"West US"},
      {val:"westus2", name:"West US2"},
      {val:"eastus", name:"East US"},
      {val:"eastus2", name:"East US2"},
      {val:"eastasia", name:"East Asia"},
      {val:"southeastasia", name:"South East Asia"},
      {val:"northeurope", name:"North Europe"},
      {val:"westeurope", name:"West Europe"}
    ];
    return (
      <>
        {regionOptions.map(opt => <option value={opt.val}>{opt.name}</option>)}
      </>
    );
}

const SelectForm = ({ title, value, onSelect, children }) => {
    return (
          <tr>
              <td align="right">{title}:</td>
              <td align="left">
                  <select
                    value={value}
                    onChange={event => onSelect(event.target.value)}
                  >
                    {children}
                  </select>
              </td>
          </tr>
    );
}

const RecognitionButtons = ({ onStart, onStop, recognizing }) => {
    return (
          <tr>
              <td align="left"><b>Speech SDK API recognizeOnceAsync:</b></td>
              <td>
                  <button id="speechsdkStartRecognizeOnceAsync" disabled={recognizing.toString()==="true" ? "disabled": ""} onClick={onStart}>recognizeOnceAsync()</button>
                  <button id="speechsdkStopRecognizeOnceAsync" disabled={recognizing.toString()==="false" ? "disabled": ""} onClick={onStop}>STOP recognizeOnceAsync()</button>
              </td>
          </tr>
    );
}

class SpeechTable extends Component {
  constructor(props) {
    super(props);
    this.state = {results: "", events: "", subscriptionKey: "YOUR_SPEECH_API_KEY", recognizing: false, language: "en-US", region:"westus"};
    this.eventStyle = {display: "inline-block",width:"500px",height:"200px",overflow: "scroll",whiteSpace: "nowrap"};
    this.resultStyle = {display: "inline-block", width:"500px", height:"200px"};
  }

  updateKey = value => this.setState({ subscriptionKey: value });
  updateLanguage = value => this.setState({ language: value });
  updateRegion = value => this.setState({ region: value });
  startRecognition = () => {
    this.setState({ recognizing: true });
    //hook speech recognition in here
  };
  endRecognition = () => {
    this.setState({ recognizing: false });
  };
  render () {
    return (
      <table>
        <Title />
        <KeyForm value={this.state.subscriptionKey} onChange={this.updateKey} />
        <SelectForm title={"Language"} value={this.state.language} onSelect={this.updateLanguage}>
          <LanguageOptions />
        </SelectForm>
        <SelectForm title={"Region"} value={this.state.region} onSelect={this.updateRegion}>
          <RegionOptions />
        </SelectForm>
        <RecognitionButtons recognizing={this.state.recognizing} onStart={this.startRecognition} onStop={this.endRecognition}/>
        
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
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
