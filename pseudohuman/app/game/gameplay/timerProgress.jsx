import ProgressBar from '@ramonak/react-progress-bar';

export default function TimerBar({ timer, timerMax }) {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 'auto',
                gap: '1vw',
            }}
        >
            <p>{timer} seconds</p>
            <ProgressBar
                completed={timer}
                bgColor='#000000'
                height='1.5vh'
                width='50vw'
                borderRadius='0'
                labelAlignment='center'
                baseBgColor={timer <= 5 ? '#cc0000' : '#00cc00'}
                labelColor='#0c0c0c'
                labelSize='1em'
                transitionDuration='0.4s'
                transitionTimingFunction='ease'
                animateOnRender
                maxCompleted={timerMax}
                customLabel=' '
                dir='rtl'
            />
        </div>
    );
}
