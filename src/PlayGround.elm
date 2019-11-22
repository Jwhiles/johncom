module PlayGround exposing (Model, Msg, init, toNavKey, update, view)

import Browser.Navigation as Nav
import Html exposing (Html, button, div, form, h2, input, p, text)
import Html.Attributes as A
import Html.Events as E
import Trie



-- MODEL


type alias Model =
    { navKey : Nav.Key
    , input : String
    , trie : Trie.Trie Char
    }


init : Nav.Key -> Model
init nk =
    { navKey = nk, input = "", trie = Trie.empty }


toNavKey : Model -> Nav.Key
toNavKey m =
    m.navKey



-- UPDATE


type Msg
    = UserChangedInput String
    | UserAddedWordToTrie


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        UserChangedInput s ->
            ( { model | input = s }, Cmd.none )

        UserAddedWordToTrie ->
            let
                newTrie =
                    Trie.insert (String.toList model.input) model.trie
            in
            ( { model | trie = newTrie }, Cmd.none )



-- VIEW


view : Model -> ( String, Html Msg )
view model =
    ( "John's secret playground", body model )


body : Model -> Html Msg
body model =
    div []
        [ form [ E.onSubmit UserAddedWordToTrie ]
            [ input
                [ A.placeholder "search string", A.value model.input, E.onInput UserChangedInput ]
                []
            , button [ E.onClick UserAddedWordToTrie ] [ text "add this word to the Trie" ]
            ]
        , div [] <|
            [ h2 [] [ text "words in the Trie" ]
            ]
                ++ viewWordsInTrie model.trie
        , div [] <|
            [ h2 [] [ text "suffixes of current input in the Trie" ]
            ]
                ++ viewSuffixesOfInput (String.toList model.input) model.trie
        ]


viewWordsInTrie : Trie.Trie Char -> List (Html msg)
viewWordsInTrie t =
    List.map ((\word -> p [] [ text word ]) << String.fromList) <| Trie.getWords t


viewSuffixesOfInput : List Char -> Trie.Trie Char -> List (Html msg)
viewSuffixesOfInput input t =
    List.map ((\word -> p [] [ text word ]) << String.fromList) <|
        Trie.getSuffixes input t
