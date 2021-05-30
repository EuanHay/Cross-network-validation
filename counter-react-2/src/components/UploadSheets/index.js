import React from 'react'

class UploadSheets extends React.Component {
    render() {
        return (
            <div>
                <button onClick={(e) => {
                    e.preventDefault();
                    window.location.href='https://forms.gle/UhRcJJg8PAhcZ2gJ7';
                }}>
                    Continue to survey
                </button>
            </div>
        )
    }
}

export default UploadSheets
