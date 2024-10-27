const React = require('react');
require('../CSS files/Home.css');

const Home = () => {
  return React.createElement(
    'div',
    { className: 'mainbox' },
    React.createElement('h1', null, 'Abstractify'),
    React.createElement('h2', null, 'Visualizing your information'),
    React.createElement(
      'div',
      { className: 'contentBox' },
      React.createElement('div', { id: 'infoBox', className: 'about' }),
      React.createElement('div', { id: 'infoBox', className: 'demos' }),
      React.createElement(
        'div',
        { className: 'bottom' },
        React.createElement('div', { id: 'infoBox', className: 'contact' }),
        React.createElement(
          'div',
          { className: 'getStarted' },
          React.createElement('a', { href: '' }, 'Get Started')
        )
      )
    )
  );
};

module.exports = Home;
