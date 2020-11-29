module Blog exposing (Blog(..), Model, build, buildFromSlug, init, toNavKey, view)

import BlogPosts as BP
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


view : Model -> ( String, Html a )
view { blogPost } =
    let
        footer =
            [ a [ A.class "bigLink", R.href R.Home ]
                [ text "Back home" ]
            , span [] [ text " | " ]
            , a [ A.class "bigLink", R.href <| R.BlogIndex Nothing ]
                [ text "Blog index" ]
            , span [] [ text " | " ]
            , a
                [ A.class "bigLink"
                , A.href "https://www.johnwhiles.com/feed"
                , A.target "_blank"
                ]
                [ text "RSS" ]
            ]
    in
    Tuple.mapSecond (\body -> div [ A.class "siteBody" ] <| body ++ footer)
        (case blogPost of
            Loading ->
                ( "Loading"
                , [ div [ A.class "loading" ]
                        [ div
                            [ A.class
                                "loading_text"
                            ]
                            [ text
                                "loading"
                            ]
                        ]
                  ]
                )

            Blog bp ->
                ( bp.title
                , [ Markdown.toHtml []
                        bp.copy
                  ]
                )

            NotFound ->
                ( "Not found", [] )
        )


find : String -> List BP.BlogIndexItem -> Maybe BP.BlogIndexItem
find s bps =
    List.head (List.filter (\bp -> bp.permalink == s) bps)


buildFromSlug : MarkDownString -> R.Slug -> Blog
buildFromSlug md slug =
    let
        link =
            R.slugToString slug

        blogIndexItem =
            find link BP.blogIndex
    in
    case blogIndexItem of
        Just bii ->
            build md bii.title bii.date

        Nothing ->
            NotFound


build : MarkDownString -> String -> Int -> Blog
build md title time =
    Blog <| BlogPost md title <| Time.millisToPosix time


init : Blog
init =
    Loading


type alias MarkDownString =
    String
