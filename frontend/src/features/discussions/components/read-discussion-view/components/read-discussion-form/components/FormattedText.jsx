import './FormattedText.css';

function FormattedText ({ content = ""}){
    const parseContent = (content) => {
        return parseMentions(content);
    };
    const parseMentions = (content) => {
        const mentionRegex = /@\S+/g;
        const parts = content.split(/(@[\S]+)/);
        
        return parts.map((part, index) => {
            if (mentionRegex.test(part)) {
                return (
                    <span className="FormattedText__mention">
                        {part}
                    </span>
                );
            }
            return part;
        });
    };

    return (
        <p className='FormattedText'>{parseContent(content)}</p>
    );
};

export default FormattedText;