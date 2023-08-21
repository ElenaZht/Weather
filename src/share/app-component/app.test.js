import React from 'react';
import {render} from '@testing-library/react';
import App from './App';

global.window = window || {};
window.matchMedia = () =>  {return {matches: false}};
test("App component renders", () => {
    render(<App/>);
    expect(document.body)

});
