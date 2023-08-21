import React from 'react';
import {render,  screen} from '@testing-library/react';
import Modal from './modal';


it("Modal component renders", () => {
    render(<Modal active={true}>
        <div data-testid='test-child'></div>
    </Modal>);
    expect(document.body);
    const container = screen.getByTestId('modal-container');
    expect(container.getElementsByClassName('active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('test-child'));


});
