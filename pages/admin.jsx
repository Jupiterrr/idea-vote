
// https://gist.github.com/emdagon/944472f39b58875045b6
// see https://github.com/reactjs/react-meteor

var IncludeTemplate = React.createClass({
  componentDidMount: function() {
    var componentRoot = React.findDOMNode(this);
    var parentNode = componentRoot.parentNode;
    parentNode.removeChild(componentRoot);
    return Blaze.render(this.props.template, parentNode);
  },
  render: function(template) {
    return (<div />)
  }
});


IndexPage = ReactMeteor.createClass({
  templateName: "AdminPage",

  startMeteorSubscriptions: function() {
    // Meteor.subscribe("ideas");
  },

  componentDidMount: function() {

  },

  getMeteorState: function() {
    // // console.log("getMeteorState")
    // IdeasStore.initialize();
    // IdeasStore.fetch();
    //
    // return {
    //   ideas: IdeasStore.getIdeas(),
    //   authenticated: !!Meteor.userId(),
    //   filter: IdeasStore.getFilter()
    // };
  },

  render: function() {
    return (
      <div className="admin-page">
        <IncludeTemplate template={Template.appDumpUI} />
      </div>
    );
  }
});
