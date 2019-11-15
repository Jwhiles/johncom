module Date exposing (renderDate)

import Time as T


renderDate : Int -> String
renderDate ms =
    let
        p =
            T.millisToPosix ms
    in
    String.join "-"
        [ String.fromInt <| T.toYear T.utc p
        , toNumericMonth <| T.toMonth T.utc p
        , String.fromInt <| T.toDay T.utc p
        ]


toNumericMonth : T.Month -> String
toNumericMonth month =
    String.fromInt <|
        case month of
            T.Jan ->
                1

            T.Feb ->
                2

            T.Mar ->
                3

            T.Apr ->
                4

            T.May ->
                5

            T.Jun ->
                6

            T.Jul ->
                7

            T.Aug ->
                8

            T.Sep ->
                9

            T.Oct ->
                10

            T.Nov ->
                11

            T.Dec ->
                12
