import GameBackground from './background/gameBg';
import MainPage from './gameWrapper';

export const metadata = { title: 'Pseudohuman - Playing' };

export default function GamePage() {
    return (
        <>
            <GameBackground />
            <MainPage />
        </>
    );
}
