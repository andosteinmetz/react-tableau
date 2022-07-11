import './App.css';
import Chart from './components/Chart';

function App() {
  return (
    <div className="App">
      <Chart url="https://prod-useast-a.online.tableau.com/t/thoughtdrivensandbox/views/GunViolence/Homicidesshootingincidentsandjailaveragedailypopulation" />
    </div>
  );
}

export default App;
