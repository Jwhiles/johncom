module BlogIndex exposing (Model, blogList, toNavKey, view)

import BlogPosts
import Browser.Navigation as Nav
import Date as D
import Html exposing (Html, a, div, h1, li, ol, text, time)
import Html.Attributes as A
import Route as R


type alias Model =
    { navKey : Nav.Key
    }


toNavKey : Model -> Nav.Key
toNavKey { navKey } =
    navKey


blogList : List BlogPosts.BlogIndexItem -> Html msg
blogList blogItems =
    ol [ A.class "blogIndexList" ] <|
        List.map
            (\{ title, permalink, date } ->
                li [ A.class "blogIndex" ]
                    [ a [ R.href <| R.BlogPost (R.Slug permalink) ]
                        [ text title
                        ]
                    , Html.br [] []
                    , time [ A.datetime <| D.renderDate date ]
                        [ text <|
                            D.renderDate date
                        ]
                    ]
            )
            blogItems


view : Html msg
view =
    div [ A.class "siteBody" ] <|
        [ h1 [] [ text "John's blog" ]
        , blogList BlogPosts.blogIndex
        , a [ R.href <| R.Home ] [ text "go home" ]
        ]
