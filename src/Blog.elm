module Blog exposing (Blog(..), Model, build, init, toNavKey, view)

import Browser.Navigation as Nav
import Html exposing (Html, a, div, span, text)
import Html.Attributes as A
import Markdown
import Route as R
import Time


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
            div [ A.class "siteBody" ]
                [ Markdown.toHtml []
                    bp.copy
                , a [ R.href R.Home ]
                    [ text "Back home" ]
                , span [] [ text " | " ]
                , a [ R.href R.BlogIndex ]
                    [ text "Blog index" ]
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
