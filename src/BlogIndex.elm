module BlogIndex exposing (Model, toNavKey, view)

import BlogPosts
import Browser.Navigation as Nav
import Html exposing (Html, a, div, text)
import Route as R


type alias Model =
    { navKey : Nav.Key
    }


toNavKey : Model -> Nav.Key
toNavKey { navKey } =
    navKey


view : Html msg
view =
    div [] <|
        [ text "todo"
        , a [ R.href <| R.Home ] [ text "go home" ]
        ]
            ++ List.map
                (\bp ->
                    a [ R.href <| R.BlogPost (R.Slug bp) ]
                        [ text bp
                        ]
                )
                BlogPosts.blogIndex
