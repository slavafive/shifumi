import "./styles/App.css";
import User from "./user/User";
import Computer from "./computer/Computer";
import { Box, Heading, Stack, Button, Wrap, WrapItem } from "@chakra-ui/react";
import { useState } from "react";
import Statistics from "./Statistics";
import Menu from "./Menu";
import NewGame from "modal-windows/NewGame";
import MatchResult from "MatchResult";
import Rules from "modal-windows/Rules";
import About from "modal-windows/About";

const getRandomOption = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * options.length)];
};

const getGameResult = (first, second) => {
  if (first === second) {
    return "draw";
  } else if (
    (first === "paper" && second === "rock") ||
    (first === "rock" && second === "scissors") ||
    (first === "scissors" && second === "paper")
  ) {
    return "win";
  } else {
    return "lose";
  }
};

const colorMapping = {
  yellow: "F2C94C",
  orange: "F2994A",
  red: "EB5757",
  pink: "EB5AA5",
  purple: "9B51E0",
  blue: "2F80ED",
  twitter: "51A8F8",
  cyan: "5AC2E6",
  teal: "5DACAB",
  whatsapp: "5DC069",
};

function App() {
  const rootDirectory = "./";

  const defaultAvatar = `${rootDirectory}assets/avatars/avatar-1.png`;

  const [userName, setUserName] = useState("Player");
  const [userAvatar, setUserAvatar] = useState(defaultAvatar);
  const [userPoints, setUserPoints] = useState(0);
  const [computerPoints, setComputerPoints] = useState(0);
  const [userOption, setUserOption] = useState("rock");
  const [computerOption, setComputerOption] = useState(null);
  const [games, setGames] = useState([]);
  const [gamesStartedCount, setGamesStartedCount] = useState(0);

  const [isNewGame, setIsNewGame] = useState(false);
  const [newGameOptions, setNewGameOptions] = useState({
    "pointsToWin": 3,
    "sharePointsInDraw": false,
    "bonusForWinsInDraw": false
  });

  const [isMatchResult, setIsMatchResult] = useState(false);
  const [areRulesOpened, setAreRulesOpened] = useState(false);
  const [isAboutOpened, setIsAboutOpened] = useState(false);
  const [showUserBonus, setShowUserBonus] = useState(false);
  const [showComputerBonus, setShowComputerBonus] = useState(false);

  const [pointsToWin, setPointsToWin] = useState(3);
  const [sharePointsInDraw, setSharePointsInDraw] = useState(false);
  const [bonusForWinsInRow, setBonusForWinsInRow] = useState(false);
  const [userColor, setUserColor] = useState("red");
  const [computerColor, setComputerColor] = useState("twitter");

  const createGame = () => {
    setPointsToWin(newGameOptions["pointsToWin"])
    setSharePointsInDraw(newGameOptions["sharePointsInDraw"])
    setBonusForWinsInRow(newGameOptions["bonusForWinsInRow"])
    setNewGameOptions({ ...newGameOptions, ...{"pointsToWin": 3 }})
    setIsMatchResult(false);
    setGames([]);
    setUserPoints(0);
    setComputerPoints(0);
    setShowUserBonus(false);
    setShowComputerBonus(false);
    setGamesStartedCount((count) => count + 1);
  };

  const isBonus = (allGames, isUser, consecutiveGames) => {
    const who = isUser ? "user" : "computer";
    let lastConsecutiveResults = 0;
    for (let i = games.length; i >= 0; i--) {
      if (
        (who == "user" && allGames[i]["result"] == "win") ||
        (who == "computer" && allGames[i]["result"] == "lose")
      ) {
        lastConsecutiveResults++;
      } else {
        break;
      }
    }
    return (
      lastConsecutiveResults > 0 &&
      lastConsecutiveResults % consecutiveGames == 0
    );
  };

  const playGame = () => {
    setShowUserBonus(false);
    setShowComputerBonus(false);

    const randomOption = getRandomOption();
    setComputerOption(randomOption);
    const result = getGameResult(userOption, randomOption);
    let newUserPoints = userPoints;
    let newComputerPoints = computerPoints;

    const game = {
      userOption: userOption,
      computerOption: randomOption,
      result: result,
    };

    switch (result) {
      case "win":
        const userBonus =
          isBonus([...games, game], true, 3) && bonusForWinsInRow;
        if (userBonus) {
          newUserPoints += 2;
          setShowUserBonus(true);
        } else {
          newUserPoints++;
        }
        break;
      case "draw":
        if (sharePointsInDraw) {
          newUserPoints += 0.5;
          newComputerPoints += 0.5;
        }
        break;
      case "lose":
        const computerBonus =
          isBonus([...games, game], false, 3) && bonusForWinsInRow;
        if (computerBonus) {
          newComputerPoints += 2;
          setShowComputerBonus(true);
        } else {
          newComputerPoints++;
        }
        break;
    }
    setUserPoints(newUserPoints);
    setComputerPoints(newComputerPoints);
    setIsMatchResult(true);

    setGames((games) => [...games, game]);
  };

  return (
    <div className="App">
      <Heading size="2xl" paddingTop="15px">
        Shifumi
      </Heading>

      <Stack
        direction="horizontal"
        justify="center"
        spacing="100px"
        marginTop="20px"
      >
        <Button colorScheme="blue" onClick={() => setIsNewGame(true)}>
          New Game
        </Button>
        <NewGame
          isOpen={isNewGame}
          createGame={createGame}
          onClose={() => {
            setIsNewGame(false)
            setNewGameOptions({ ...newGameOptions, ...{"pointsToWin": 3 }})
          }}
          pointsToWin={pointsToWin}
          setPointsToWin={setPointsToWin}
          sharePointsInDraw={sharePointsInDraw}
          setSharePointsInDraw={setSharePointsInDraw}
          bonusForWinsInRow={bonusForWinsInRow}
          setBonusForWinsInRow={setBonusForWinsInRow}
          newGameOptions={newGameOptions}
          setNewGameOptions={setNewGameOptions}
        ></NewGame>

        <MatchResult
          isOpen={
            (userPoints >= pointsToWin || computerPoints >= pointsToWin) &&
            isMatchResult
          }
          onClose={() => setIsMatchResult(false)}
          createGame={() => {
            setIsNewGame(true);
          }}
          userName={userName}
          computerName="Computer"
          userPoints={userPoints}
          computerPoints={computerPoints}
          rootDirectory={rootDirectory}
        ></MatchResult>

        <Rules
          isOpen={areRulesOpened}
          onClose={() => setAreRulesOpened(false)}
        />

        <About isOpen={isAboutOpened} onClose={() => setIsAboutOpened(false)} />

        <Button colorScheme="blue" onClick={() => setAreRulesOpened(true)}>
          Rules
        </Button>
        <Button colorScheme="blue" onClick={() => setIsAboutOpened(true)}>
          About
        </Button>
      </Stack>

      <Wrap spacing="10px" justify="center" marginTop="25px">
        <WrapItem>
          <User
            userName={userName}
            avatar={userAvatar}
            option={userOption}
            setOption={setUserOption}
            points={userPoints}
            pointsToWin={pointsToWin}
            color={colorMapping[userColor]}
            playGame={playGame}
            showBonus={showUserBonus}
            canPlay={
              userPoints < pointsToWin &&
              computerPoints < pointsToWin &&
              !isNewGame &&
              gamesStartedCount > 0
            }
            rootDirectory={rootDirectory}
          ></User>
        </WrapItem>

        <WrapItem>
          <Computer
            playerName="Computer"
            option={computerOption}
            setOption={setComputerOption}
            points={computerPoints}
            pointsToWin={pointsToWin}
            color={colorMapping[computerColor]}
            showBonus={showComputerBonus}
            rootDirectory={rootDirectory}
          ></Computer>
        </WrapItem>

        <WrapItem>
          <Box w="600px" h="420px" bg="white">
            <Statistics
              games={games}
              rootDirectory={rootDirectory}
            ></Statistics>
          </Box>
        </WrapItem>

        <WrapItem>
          <Box w="600px" h="420px" bg="white">
            <Menu
              userName={userName}
              setUserName={setUserName}
              userAvatar={userAvatar}
              setUserAvatar={setUserAvatar}
              userColor={userColor}
              setUserColor={setUserColor}
              computerColor={computerColor}
              setComputerColor={setComputerColor}
              pointsToWin={pointsToWin}
              sharePointsInDraw={sharePointsInDraw}
              setSharePointsInDraw={setSharePointsInDraw}
              bonusForWinsInRow={bonusForWinsInRow}
              setBonusForWinsInRow={setBonusForWinsInRow}
              rootDirectory={rootDirectory}
            ></Menu>
          </Box>
        </WrapItem>
      </Wrap>
    </div>
  );
}

export default App;
