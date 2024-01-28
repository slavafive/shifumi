import { useState } from "react";
import { Image, Center, Box, Heading } from "@chakra-ui/react";
import winIconSrc from "assets/game-results/win.png";
import drawIconSrc from "assets/game-results/draw.png";
import loseIconSrc from "assets/game-results/lose.png";

import {
  Table,
  TableContainer,
  TableCaption,
  Tbody,
  Thead,
  Th,
  Tr,
  Td,
} from "@chakra-ui/react";

function Statistics({ games }) {

  const gameIconsSrc = {
    win: winIconSrc,
    draw: drawIconSrc,
    lose: loseIconSrc,
  };

  return (
    <Box overflowY="auto" maxHeight="360px">
    <Heading>Statistics</Heading>
      <TableContainer marginTop="20px">
        <Table variant="striped" colorScheme="simple" size="sm">
          <Thead>
            <Tr>
              <Th>
                <Center>№</Center>
              </Th>
              <Th>
                <Center>User</Center>
              </Th>
              <Th>
                <Center>Computer</Center>
              </Th>
              <Th>
                <Center>Result</Center>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {games.map((game, i) => (
              <Tr key={"game" + i}>
                <Td>
                  <Center>{i + 1}</Center>
                </Td>
                <Td>
                  <Center>{game["userOption"]}</Center>
                </Td>
                <Td>
                  <Center>{game["computerOption"]}</Center>
                </Td>
                <Td>
                  <Center>
                    <Image
                      boxSize="25px"
                      objectFit="cover"
                      src={gameIconsSrc[game["result"]]}
                      alt="win"
                    ></Image>
                  </Center>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Statistics;
