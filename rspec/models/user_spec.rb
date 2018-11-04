require 'rails_helper'


RSpec.describe User, type: :model do

  let(:valid_attributes) do
    {
      name: "Asafaa",
    }
  end

  it "is valid when expected" do
    expect(User.new(valid_attributes)).to be_valid
  end


end
