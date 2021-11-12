import ReactDOM from 'react-dom'
import App from './App'
import { TokenSalesProvider } from './contexts/TokenSalesContext';

ReactDOM.render(
    <TokenSalesProvider>
        <App />
    </TokenSalesProvider>,
    document.querySelector('#root')
);