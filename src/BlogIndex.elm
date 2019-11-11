module BlogIndex exposing (view)

import BlogPosts
import Html exposing (Html, a, div, h1, text)
import Route as R


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
