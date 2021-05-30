import React, {useState} from 'react';

// Utility components

export async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const Elipsis = '\u2026'

export function Address({addr, network = window.network}) {
    return <a href={network && network.etherscan && network.etherscan + addr} target="etherscan">
    <span style={{"fontFamily": "monospace"}}>
      {("" + addr).replace(/^(.{6})(?:.*)(.{4})$/, `$1${Elipsis}$2`)}
    </span></a>
}

export function ActionButton({title, action, enabled=true, onError}) {

    const [disabled, setDisabled] = useState(!enabled)

    const onClick = () => {
        onError && onError(null);
        setDisabled(true);
        action()
            .catch(err => onError && onError(err))
            .finally(() => setDisabled(false))
    }

    return <button
        disabled={disabled}
        onClick={onClick}>
        {title}
    </button>
}

function formatDate(date) {
    if (!date) return ""
    const min = (Date.now() - date.getTime())/1000/60
    if ( min < 1 ) return "less than a minute ago"
    if ( min < 120) return `${Math.round(min)} minutes ago`
    const hour = min/60
    if ( hour < 48 ) return `${Math.round(hour)} hours ago`
    const days = hour/24
    // if ( days < 14 )
    return `${Math.round(days)} days ago`
}
export function LogEvent({cur, prev, date}) {
    return <div> Count incremented {formatDate(date)}</div>
}

/**
 * return a list of events to display (showing only the first "last" entries.)
 * note that the list is assumed to be sorted in reverse order
 */
export function Log({events, last = 5}) {
    return <ul>
        {events && events.slice(0, last).map((e, key) =>
            <li key={key}><LogEvent cur={e.currentHolder} prev={e.previousHolder} date={e.date}/></li>
        )}
    </ul>
}

export function Progress({status, step, total}) {
    return <pre>
      {total && ('['.padEnd(step, '=') + '>').padEnd(total + 1) + '] '}
        {status && status}
   </pre>
}
