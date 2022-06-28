import React, { useState } from 'react';

// import this ADD_REACTION mutation and the useMutation Hook into the ReactionForm component file
const [addReaction, { error }] = useMutation(ADD_REACTION);

// Note that this component expects to be given a prop called thoughtId. This ID will be necessary when it comes time to call the mutation. 
const ReactionForm = ({ thoughtId }) => {

    // state variables and handler functions
    const [reactionBody, setBody] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // add thought to database
            await addReaction({
                variables: { reactionBody, thoughtId }
            });

            // clear form value
            setBody('');
            setCharacterCount(0);
        } catch (e) {
            console.error(e);
        }
    };

// Updating the cache works seamlessly, because the mutation returns the parent thought object that includes the updated reactions array as a property. If the mutation returned the reaction object instead, then we'd have another situation in which the cache would need a manual update.





    return (
        <div>
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                Character Count: {characterCount}/280
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
                <textarea
                    placeholder="Leave a reaction to this thought..."
                    className="form-input col-12 col-md-9"
                    value={reactionBody}
                    onChange={handleChange}
                ></textarea>

                <button className="btn col-12 col-md-3" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default ReactionForm;
