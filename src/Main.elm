module Main exposing (main)

import Blog
import Browser
import Browser.Navigation as Nav
import Html exposing (Html, a, div, h1, text)
import Platform.Sub as Sub
import Route as R exposing (Route(..))
import Url exposing (Url)


main =
    Browser.application
        { init = init
        , onUrlChange = ChangedUrl
        , onUrlRequest = ClickedLink
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


type alias Model =
    { navKey : Nav.Key
    , rest : SubModel
    }


type SubModel
    = Home
    | BlogModel Blog.Model


type Msg
    = ClickedLink Browser.UrlRequest
    | ChangedUrl Url



-- @todo  decode the initial route here?


init : () -> Url -> Nav.Key -> ( Model, Cmd Msg )
init _ url navKey =
    changeRouteTo (R.fromUrl url) (Model navKey Home)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        --@todo   parse the new url from the link click
        ClickedLink urlRequest ->
            case urlRequest of
                Browser.Internal url ->
                    ( model
                    , Nav.pushUrl model.navKey (Url.toString url)
                    )

                Browser.External href ->
                    ( model
                    , Nav.load href
                    )

        ChangedUrl url ->
            changeRouteTo (R.fromUrl url) model


changeRouteTo : Maybe Route -> Model -> ( Model, Cmd Msg )
changeRouteTo maybeRoute model =
    case maybeRoute of
        Nothing ->
            ( model, Cmd.none )

        Just R.Home ->
            ( { model | rest = Home }
            , Cmd.none
            )

        Just (R.Blog slug) ->
            ( { model | rest = BlogModel Blog.Blogel }, Cmd.none )


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> Browser.Document Msg
view model =
    Browser.Document "Title" <| [ body model ]


body : Model -> Html Msg
body model =
    case model.rest of
        Home ->
            div []
                [ h1 [] [ text "welcome to my internet house" ]
                , a [ R.href <| Blog (R.Slug "hello") ] [ text "click me" ]
                ]

        BlogModel blogModel ->
            Blog.view blogModel
