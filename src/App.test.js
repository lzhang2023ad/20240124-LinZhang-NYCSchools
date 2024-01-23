import { render, screen } from '@testing-library/react';
import App from './App';

test('render App', () => {
    render(<App />);
    const selectText = screen.getByText('Select');
    expect(selectText).toBeInTheDocument();
});
