module Blog exposing (Blog(..), Model, build, init, toNavKey, view)

import Browser.Navigation as Nav
import Html exposing (Html, a, div, text)
import Markdown
import Route as R
import Time
import TimeHelpers exposing (getDate)


type alias Model =
    { navKey : Nav.Key
    , blogPost : Blog
    }


toNavKey : Model -> Nav.Key
toNavKey { navKey } =
    navKey


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


view : Model -> Html a
view { blogPost } =
    case blogPost of
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
