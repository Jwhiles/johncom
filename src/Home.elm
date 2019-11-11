module Home exposing (view)

import Html exposing (Html, a, div, h1, text)
import Route as R


view : Html msg
view =
    div []
        [ h1 [] [ text "testing" ]
        , a [ R.href <| R.BlogIndex ] [ text "Blog" ]
        , a [ R.href <| R.BlogPost (R.Slug "programming") ] [ text "BlogPost" ]
        ]
