module TimeHelpers exposing (getDate)

import Time


getDate : Time.Posix -> String
getDate t =
    let
        year =
            String.fromInt <| Time.toYear Time.utc t

        month =
            String.fromInt <| monthToInt <| Time.toMonth Time.utc t

        day =
            String.fromInt <| Time.toDay Time.utc t
    in
    String.join "-" [ year, month, day ]


monthToInt : Time.Month -> Int
monthToInt month =
    case month of
        Time.Jan ->
            1

        Time.Feb ->
            2

        Time.Mar ->
            3

        Time.Apr ->
            4

        Time.May ->
            5

        Time.Jun ->
            6

        Time.Jul ->
            7

        Time.Aug ->
            8

        Time.Sep ->
            9

        Time.Oct ->
            10

        Time.Nov ->
            11

        Time.Dec ->
            12
