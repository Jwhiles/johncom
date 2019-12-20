module TrieTest exposing (..)

import Expect exposing (Expectation)
import Fuzz exposing (Fuzzer, int, list, string)
import Set
import Test exposing (..)
import Trie exposing (..)


suite : Test
suite =
    describe "The Trie module" <|
        [ describe "Trie.insert and Trie.contains"
            [ test "trie will contain inserted word" <|
                \_ ->
                    Expect.true "expected the trie to contain hello"
                        (Trie.contains (String.toList "hello") <|
                            Trie.insert (String.toList "hello") Trie.empty
                        )
            , test "trie can contain multiple insert words" <|
                \_ ->
                    Expect.true "expected the trie to contain hello and hell" <|
                        let
                            trie =
                                Trie.insert (String.toList "hell") <| Trie.insert (String.toList "hello") Trie.empty
                        in
                        Trie.contains (String.toList "hello") trie && Trie.contains (String.toList "hell") trie
            , test "Trie does not consider itself to contain words that only exist as suffixes will contain inserted word" <|
                \_ ->
                    Expect.false "expected the trie no to contain hell"
                        (Trie.contains (String.toList "hell") <|
                            Trie.insert (String.toList "hello") Trie.empty
                        )
            ]
        , describe "Trie.getWords"
            [ test "Trie.getWords returns all the words that have been added" <|
                \_ ->
                    let
                        words =
                            List.map String.toList [ "one", "two", "oblong" ]

                        trie =
                            List.foldr Trie.insert Trie.empty words
                    in
                    Expect.equalSets (Set.fromList <| Trie.getWords trie)
                        (Set.fromList words)
            ]
        , describe "Trie.getSuffixes returns all the words that are a valid extension on an input word" <|
            let
                x =
                    ""

                words =
                    List.map String.toList
                        [ "hello"
                        , "hero"
                        , "helical"
                        , "egg"
                        ]

                trie =
                    List.foldr Trie.insert Trie.empty words
            in
            [ test "returns all words if input is string is empty" <|
                \_ ->
                    Expect.equalSets (Set.fromList <| Trie.getSuffixes [] trie)
                        (Set.fromList words)
            , test "returns no words if there are no matching words" <|
                \_ ->
                    Expect.equal [] <| Trie.getSuffixes (String.toList "peanut") trie
            , test "returns appropriate words if there are matches" <|
                \_ ->
                    Expect.equal
                        (Set.fromList <|
                            Trie.getSuffixes (String.toList "he")
                                trie
                        )
                        (Set.fromList <| List.map String.toList [ "hello", "hero", "helical" ])
            ]
        ]



-- TODO write property tests :)