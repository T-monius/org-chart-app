require 'pry'

class NodesController < ApplicationController
  skip_forgery_protection :only => [:update]

  def index
    all_nodes = Node.all
    respond_to do |format|
      format.html { render html: "There are #{all_nodes.count} nodes" }
      format.json { render json: all_nodes }
    end
  end

  def update
    node = Node.find(params[:id])

    if node.update(node_params)
      all_nodes = Node.all
      render json: all_nodes
    else
      error = node.errors.full_messages.join(', ')
      render json: error , status: 404
    end
  end

  private

  def node_params
    params.require(:node).permit(:parent_id)
  end
end
