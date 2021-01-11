import { Component } from 'react';
import './App.css';
import { AudioConfig, CancellationDetails, CancellationReason, NoMatchDetails, NoMatchReason, ResultReason, SpeechConfig, SpeechRecognizer } from 'microsoft-cognitiveservices-speech-sdk';

const cr = '\n';

const ResultForm = ({title, text, style}) => {
    return (
        <tr>
            <td align="right">{title}</td>
            <td align="left">
              <textarea 
                readOnly
                style={style} 
                value={text}
                />
            </td>
        </tr>
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
          <td align="left">
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
        {languageOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.name}</option>)}
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
        {regionOptions.map(opt => <option key={opt.val} value={opt.val}>{opt.name}</option>)}
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
        <td align="right"><b>Call Speech SDK method:</b></td>
        <td align="left">
          <button id="speechsdkStartRecognizeOnceAsync" disabled={recognizing.toString()==="true" ? "disabled": ""} onClick={onStart}>recognizeOnceAsync()</button>
          <button id="speechsdkStopRecognizeOnceAsync" disabled={recognizing.toString()==="false" ? "disabled": ""} onClick={onStop}>STOP recognizeOnceAsync()</button>
        </td>
      </tr>
    );
}

const getRecognizer = (key, region, language) => {
  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

  const speechConfig = SpeechConfig.fromSubscription(key, region);

  speechConfig.speechRecognitionLanguage = language;
  return new SpeechRecognizer(speechConfig, audioConfig);
};

const setRecognizerCallbacks = (reco, componentRef) => {
  reco.recognizing = function (s, e) {
    window.console.log(e);
    componentRef.setState((state) => ({ events: state.events + "(recognizing) Reason: " + ResultReason[e.result.reason] + " Text: " + e.result.text + cr, results: e.result.text}));
  };
  // The event signals that the service has stopped processing speech.
  // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
  // This can happen for two broad classes or reasons.
  // 1. An error is encountered.
  //    In this case the .errorDetails property will contain a textual representation of the error.
  // 2. No additional audio is available.
  //    Caused by the input stream being closed or reaching the end of an audio file.
  reco.canceled = function (s, e) {
      window.console.log(e);

      let eventText = "(cancel) Reason: " + CancellationReason[e.reason];
      if (e.reason === CancellationReason.Error) {
        eventText += ": " + e.errorDetails;
      }
      componentRef.setState((state) => ({ events: state.events + eventText + cr }));
  };

  // The event recognized signals that a final recognition result is received.
  // This is the final event that a phrase has been recognized.
  // For continuous recognition, you will get one recognized event for each phrase recognized.
  reco.recognized = function (s, e) {
      window.console.log(e);

      // Indicates that recognizable speech was not detected, and that recognition is done.
      let eventText = "";
      if (e.result.reason === ResultReason.NoMatch) {
        var noMatchDetail = NoMatchDetails.fromResult(e.result);
        eventText += "(recognized)  Reason: " + ResultReason[e.result.reason] + " NoMatchReason: " + NoMatchReason[noMatchDetail.reason] + cr;
      } else {
        eventText += "(recognized)  Reason: " + ResultReason[e.result.reason] + " Text: " + e.result.text + cr;
      }
      componentRef.setState((state) => ({ events: state.events + eventText + cr }));
  };

  // Signals that a new session has started with the speech service
  reco.sessionStarted = function (s, e) {
    window.console.log(e);
    componentRef.setState((state) => ({ events: state.events + `(sessionStarted) SessionId: ${e.sessionId}` + cr }));
  };

  // Signals the end of a session with the speech service.
  reco.sessionStopped = function (s, e) {
    window.console.log(e);
    componentRef.setState((state) => ({ events: state.events + `(sessionStopped) SessionId: ${e.sessionId}` + cr }));
  };

  // Signals that the speech service has started to detect speech.
  reco.speechStartDetected = function (s, e) {
    window.console.log(e);
    componentRef.setState((state) => ({ events: state.events + `(speechStartDetected) SessionId: ${e.sessionId}` + cr }));
  };

  // Signals that the speech service has detected that speech has stopped.
  reco.speechEndDetected = function (s, e) {
    window.console.log(e);
    componentRef.setState((state) => ({ events: state.events + `(speechEndDetected) SessionId: ${e.sessionId}` + cr }));
  };
};

const recognizeWith = (reco, componentRef) => {
  // Note: this is how to process the result directly rather than subscribing to the recognized event
  // The continuation below shows how to get the same data from the final result as you'd get from the
  // events above.
  reco.recognizeOnceAsync(
    function (result) {
        window.console.log(result);

        let eventText = "(continuation) Reason: " + ResultReason[result.reason];
        switch (result.reason) {
          case ResultReason.RecognizedSpeech:
            eventText += " Text: " + result.text;
            break;
          case ResultReason.NoMatch:
            var noMatchDetail = NoMatchDetails.fromResult(result);
            eventText += " NoMatchReason: " + NoMatchReason[noMatchDetail.reason];
            break;
          case ResultReason.Canceled:
            var cancelDetails = CancellationDetails.fromResult(result);
            eventText += " CancellationReason: " + CancellationReason[cancelDetails.reason];
            if (cancelDetails.reason === CancellationReason.Error) {
              eventText += ": " + cancelDetails.errorDetails;
            }
            break;
          default:
            break;
        }
        componentRef.setState((state) => ({ events: state.events + eventText + cr, results: result.text + cr, recognizing: false }));
    },
    function (err) {
      componentRef.setState({ results: "ERROR: " + err, recognizing: false });
    });
};

class SpeechTable extends Component {
  constructor(props) {
    super(props);
    this.state = {results: "(from Microphone)", events: "", subscriptionKey: "YOUR_SPEECH_API_KEY", recognizing: false, language: "en-US", region:"westus"};
    this.eventStyle = {display: "inline-block", whiteSpace:"pre-line", width:"500px",height:"200px",overflow: "scroll"};
    this.resultStyle = {display: "inline-block", width:"500px", whiteSpace:"pre-line", height:"200px"};
    this.reco = undefined;
  }

  updateKey = value => this.setState({ subscriptionKey: value });
  updateLanguage = value => this.setState({ language: value });
  updateRegion = value => this.setState({ region: value });

  startRecognition = () => {
    this.reco = getRecognizer(this.state.subscriptionKey, this.state.region, this.state.language);
    if(this.reco !== undefined && this.reco !== null) {
      this.setState({results: "", events: "", recognizing: true});

      setRecognizerCallbacks(this.reco, this);
      recognizeWith(this.reco, this);
    }
  };

  disposeReco = () => {
    this.reco.close();
    this.reco = undefined;
  };

  endRecognition = () => {
    this.setState({ recognizing: false });
    if(this.reco !== undefined && this.reco !== null) {
      this.reco.stopContinuousRecognitionAsync(
        () => this.disposeReco(),
        (e) => this.disposeReco()
      );
    }
  };

  render () {
    return (
      <table>
        <tbody>
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
        </tbody>
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
