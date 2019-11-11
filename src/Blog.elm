module Blog exposing (Blog(..), blogIndex, build, init, view)

import Dict exposing (Dict)
import Html exposing (Html, a, div, text)
import Markdown
import Route as R
import Time
import TimeHelpers exposing (getDate)


type Blog
    = Blog BlogPost
    | NotFound



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


init : R.Slug -> Blog
init slug =
    Blog { copy = "hello", title = R.slugToString slug, date = Time.millisToPosix 1572857902 }


type alias MarkDownString =
    String



-- could use the


blogIndex : List String
blogIndex =
    [ "2019-11-04-i-want-to-write"
    ]
