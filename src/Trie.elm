module Trie exposing (..)

import Dict exposing (Dict)


type Trie a
    = Node (List a) (Dict a (Trie a))
    | Empty (Dict a (Trie a))


getChildren : Trie a -> Dict a (Trie a)
getChildren t =
    case t of
        Node _ children ->
            children

        Empty children ->
            children


setChildren : Trie a -> Dict a (Trie a) -> Trie a
setChildren trie newChildren =
    case trie of
        Node s _ ->
            Node s newChildren

        Empty _ ->
            Empty newChildren


getValue : Trie a -> Maybe (List a)
getValue t =
    case t of
        Node v _ ->
            Just v

        Empty _ ->
            Nothing


empty : Trie a
empty =
    Empty Dict.empty


insert : List comparable -> Trie comparable -> Trie comparable
insert word trie =
    let
        recurse s t =
            case s of
                [] ->
                    Node word (getChildren t)

                character :: rest ->
                    let
                        children =
                            getChildren t
                    in
                    case Dict.get character children of
                        Just matchingChildNode ->
                            setChildren t
                                (Dict.insert character
                                    (recurse rest
                                        matchingChildNode
                                    )
                                    children
                                )

                        Nothing ->
                            setChildren t
                                (Dict.insert character
                                    (recurse rest empty)
                                    children
                                )
    in
    recurse word trie


contains : List comparable -> Trie comparable -> Bool
contains cs trie =
    case ( cs, trie ) of
        ( [], Node _ _ ) ->
            True

        ( [], _ ) ->
            False

        ( character :: rest, t ) ->
            case
                Dict.get character (getChildren t)
            of
                Just matchingChildNode ->
                    contains rest matchingChildNode

                Nothing ->
                    False


getWords : Trie a -> List (List a)
getWords t =
    (getValue >> maybeToList) t
        ++ Dict.foldr
            (\_ node acc ->
                getWords node
                    ++ acc
            )
            []
            (getChildren t)


maybeToList : Maybe a -> List a
maybeToList ma =
    case ma of
        Just a ->
            [ a ]

        Nothing ->
            []


getSuffixes : List comparable -> Trie comparable -> List (List comparable)
getSuffixes word t =
    case word of
        [] ->
            getWords t

        character :: rest ->
            case
                Dict.get character (getChildren t)
            of
                Just matchingChildNode ->
                    getSuffixes rest matchingChildNode

                Nothing ->
                    []
