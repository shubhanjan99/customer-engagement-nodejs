import React from 'react';
import { ButtonsGroup } from 'watson-react-components';
import { Icon, Colors } from 'watson-react-components';
// const Icon = require('test/components/Icon');
// import { Icon } from 'watson-react-components';
// const WebsterIcons = require('aprilwebster-react-components');

const ConversationItem = React.createClass({
  displayName: 'ConversationItem',

  propTypes: {
    //eslint-disable-next-line
    utterance: React.PropTypes.object.isRequired,
    //tone_analyzer_response: React.PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      utterance: '',
    };
  },

  getInitialState() {
    return {
      vote: null,
    };
  },

  isFirstToneNegative(tones) {
    const firstTone = tones[0];
    return (
      tones.length !== 0 &&
      (firstTone.tone === 'sad' ||
      firstTone.tone === 'frustrated' ||
      firstTone.tone === 'anxious' ||
      firstTone.tone === 'impolite')
    );
  },

  test() {
    console.log('clicked');
    // console.log(score);
    // console.log(vote);
  },

  logVote(vote) {
    console.log('vote:');
    console.log(vote);
  },

  render() {
    const user = this.props.utterance.user;
    const statement = this.props.utterance.statement;
    const tones = this.props.utterance.tones;

    return (
      <div className={user.type === 'customer' ? 'speaker consumer' : 'speaker'}>
        <div className="avatar">
          <div className={user.type === 'customer' ? 'customer_avatar' : 'agent_avatar'} />
        </div>
        <div className="statement_container">
          <span className="speaker_name">{user.name}</span>
          <span className="speaker_handle">{user.handle}</span>
          <span className="time_stamp"> {statement.timestamp}</span>
          <div
            className={this.isFirstToneNegative(tones) ? 'speaker_statement negative' : 'speaker_statement'}
          >
            { statement.text }
          </div>
        </div>
        <div className="score_container">
          { tones.length === 0 ?
            <div className="tone_text">{ 'None' }</div> :
            tones.map(t => (
              <div className="tone_results" key={`${t.tone}-${t.score}`}>
                <div
                  className={this.isFirstToneNegative(tones) ? 'tone_text negative' : 'tone_text'}
                >{t.tone}
                </div>
                {/*
                <span className="voteicon">👍</span>
                <span className="voteicon">👎</span>
                */}
                <ButtonsGroup
                  type="radio"  // radio, button, or checkbox
                  name="radio-buttons"
                  onClick={e => console.log('clicked', e)}
                  onChange={e => console.log('changed', e)}
                  buttons={[{
                    value: 1,
                    id: 'vote-thumbsup',  // id's must be unique across the entire page. Default value is name-value
                    text: 'agree',
                  }, {
                    value: 2,
                    id: 'vote',
                    text: 'vote-thumbsdown',
                  }]}
                />
              </div>
            ))}
        </div>
      </div>
    );
  },
});

export default ConversationItem;
