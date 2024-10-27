const React = require('react');
const { useEffect } = React;

const RenderVisualAbstract = ({ jsx, css }) => {
    useEffect(() => {
        // Create a style tag with the provided CSS and append it to the document
        const style = document.createElement('style');
        style.innerHTML = css;
        document.head.appendChild(style);

        return () => {
            // Cleanup: remove the style tag when component unmounts
            document.head.removeChild(style);
        };
    }, [css]);

    // Instead of eval, parse the JSX string and create an element
    const JSXComponent = new Function(`return ${jsx}`)(); // Using Function constructor instead of eval

    return <JSXComponent />;
};

// Export the component
module.exports = RenderVisualAbstract;
