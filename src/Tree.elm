module Tree exposing (view)

import Html exposing (..)


type
    Tree a
    -- a tree is a node, with a list of child nodes.
    = Node a (List (Tree a))


getWidths : Tree a -> List Int
getWidths (Node _ children) =
    let
        childWidths =
            zipLotsOfLists <| List.map getWidths children
    in
    [ List.length children ] ++ childWidths


zip : List Int -> List Int -> List Int
zip l1 l2 =
    -- take two lists of ints and return a list of those ints added up
    case ( l1, l2 ) of
        ( lhead :: rest, l2head :: rest2 ) ->
            lhead + l2head :: zip rest rest2

        ( lhead :: rest, [] ) ->
            lhead + 0 :: zip rest []

        ( [], rhead :: rrest ) ->
            rhead + 0 :: zip [] rrest

        _ ->
            []


zipLotsOfLists : List (List Int) -> List Int
zipLotsOfLists =
    List.foldr zip []


myTree : Tree Int
myTree =
    Node 1 [ Node 2 [ Node 4 [], Node 5 [] ], Node 8 [], Node 3 [ Node 6 [], Node 7 [] ] ]


view : Html msg
view =
    div [] [ text <| String.fromInt <| getWidths myTree ]
