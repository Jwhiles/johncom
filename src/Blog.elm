module Blog exposing (Blog(..), build, init, view)

import Html exposing (Html, a, div, text)
import Markdown
import Route as R
import Time
import TimeHelpers exposing (getDate)


type Blog
    = Blog BlogPost
    | NotFound
    | Loading



-- internal type


type alias BlogPost =
    { copy : String
    , title : String
    , date : Time.Posix
    }



---


view : Blog -> Html a
view b =
    case b of
        Loading ->
            div [] [ text "loading" ]

        Blog bp ->
            div []
                [ a [ R.href R.Home ]
                    [ text "take meeee home" ]
                , Markdown.toHtml []
                    bp.copy
                ]

        NotFound ->
            div [] []


build : MarkDownString -> String -> Blog
build md title =
    Blog <| BlogPost md title <| Time.millisToPosix 1572857902


init : Blog
init =
    Loading


type alias MarkDownString =
    String
